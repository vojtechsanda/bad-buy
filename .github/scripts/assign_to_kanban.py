#!/usr/bin/env python3
"""
Assigns weekly report issues to the BadBuy kanban project,
matching each issue to the correct sprint based on the date range in its title.
"""

import subprocess
import json
import re
import sys
from datetime import datetime, timedelta

OWNER = "vojtechsanda"
REPO = "bad-buy"


def gh_graphql(query, variables=None):
    cmd = ["gh", "api", "graphql", "-f", f"query={query}"]
    if variables:
        for k, v in variables.items():
            if isinstance(v, int):
                cmd.extend(["-F", f"{k}={v}"])
            else:
                cmd.extend(["-f", f"{k}={v}"])
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  [GraphQL CLI error] {result.stderr.strip()}")
        return None
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"  [JSON parse error] {e}: {result.stdout[:200]}")
        return None
    if "errors" in data:
        print(f"  [GraphQL errors] {data['errors']}")
        return None
    return data


def find_project():
    """Find the BadBuy project for the repo owner."""
    query = """
    query($login: String!) {
      user(login: $login) {
        projectsV2(first: 20) {
          nodes {
            id
            title
            number
            fields(first: 30) {
              nodes {
                ... on ProjectV2IterationField {
                  id
                  name
                  configuration {
                    iterations {
                      id
                      title
                      startDate
                      duration
                    }
                    completedIterations {
                      id
                      title
                      startDate
                      duration
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """
    data = gh_graphql(query, {"login": OWNER})
    if not data:
        return None, None

    projects = data["data"]["user"]["projectsV2"]["nodes"]
    print(f"Found {len(projects)} project(s):")
    for p in projects:
        print(f"  - {p['title']} (#{p['number']})")

    if not projects:
        print("No projects found for user!")
        return None, None

    # Find BadBuy project by name (case-insensitive)
    project = None
    for p in projects:
        title_lower = p["title"].lower()
        if "bad" in title_lower or "buy" in title_lower:
            project = p
            break

    if not project:
        project = projects[0]
        print(f"No BadBuy project found by name, using first: {project['title']}")

    print(f"\nUsing project: {project['title']} (#{project['number']})")

    # Find the iteration/sprint field
    sprint_field = None
    for field in project["fields"]["nodes"]:
        if field and field.get("configuration") and field["configuration"].get("iterations") is not None:
            sprint_field = field
            break

    if not sprint_field:
        print("No sprint/iteration field found in the project!")
        return project, None

    return project, sprint_field


def parse_sprint_dates(iteration):
    start = datetime.strptime(iteration["startDate"], "%Y-%m-%d")
    end = start + timedelta(days=iteration["duration"] - 1)
    return start.date(), end.date()


def parse_issue_dates(title):
    """Parse start and end date from issue title like 'Week report 07 | 20/04 - 26/04'."""
    match = re.search(r"(\d{2}/\d{2})\s*-\s*(\d{2}/\d{2})", title)
    if not match:
        return None, None
    start_str, end_str = match.groups()

    def parse_date(s):
        day, month = map(int, s.split("/"))
        year = 2026  # project started in 2026
        return datetime(year, month, day).date()

    return parse_date(start_str), parse_date(end_str)


def get_issue_node_id(number):
    q = """
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
          title
        }
      }
    }
    """
    d = gh_graphql(q, {"owner": OWNER, "repo": REPO, "number": number})
    if not d:
        return None
    return d["data"]["repository"]["issue"]["id"]


def add_issue_to_project(project_id, issue_node_id):
    mutation = """
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item {
          id
        }
      }
    }
    """
    d = gh_graphql(mutation, {"projectId": project_id, "contentId": issue_node_id})
    if not d:
        return None
    return d["data"]["addProjectV2ItemById"]["item"]["id"]


def set_sprint(project_id, item_id, field_id, iteration_id):
    mutation = """
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $iterationId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { iterationId: $iterationId }
      }) {
        projectV2Item {
          id
        }
      }
    }
    """
    return gh_graphql(
        mutation,
        {
            "projectId": project_id,
            "itemId": item_id,
            "fieldId": field_id,
            "iterationId": iteration_id,
        },
    )


# Weekly report issues: (issue_number, title_with_date_range)
WEEKLY_ISSUES = [
    (10, "Week report 01 | 09/03 - 15/03"),
    (11, "Week report 02 | 16/03 - 22/03"),
    (12, "Week report 03 | 23/03 - 29/03"),
    (13, "Week report 04 | 30/03 - 05/04"),
    (14, "Week report 05 | 06/04 - 12/04"),
    (15, "Week report 06 | 13/04 - 19/04"),
    (16, "Week report 07 | 20/04 - 26/04"),
    (17, "Week report 08 | 27/04 - 03/05"),
    (18, "Week report 09 | 04/05 - 10/05"),
    (19, "Week report 10 | 11/05 - 17/05"),
    (20, "Week report 11 | 18/05 - 24/05"),
    (21, "Week report 12 | 25/05 - 31/05"),
]


def main():
    project, sprint_field = find_project()
    if not project:
        print("ERROR: Could not find project. Make sure the token has 'project' scope.")
        sys.exit(1)
    if not sprint_field:
        print("ERROR: No sprint/iteration field found in the project.")
        sys.exit(1)

    all_iterations = sprint_field["configuration"]["iterations"] + sprint_field["configuration"].get("completedIterations", [])

    print(f"\nSprint field: {sprint_field['name']}")
    print(f"Found {len(all_iterations)} sprint(s):")
    for it in all_iterations:
        s, e = parse_sprint_dates(it)
        print(f"  - '{it['title']}': {s} to {e}")

    print("\nProcessing weekly report issues...")
    success_count = 0
    fail_count = 0

    for issue_num, title in WEEKLY_ISSUES:
        issue_start, issue_end = parse_issue_dates(title)
        if not issue_start:
            print(f"  Issue #{issue_num}: Could not parse dates from '{title}'")
            fail_count += 1
            continue

        # Find matching sprint: issue start date falls within sprint date range
        matching_sprint = None
        for iteration in all_iterations:
            sprint_start, sprint_end = parse_sprint_dates(iteration)
            if sprint_start <= issue_start <= sprint_end or sprint_start <= issue_end <= sprint_end:
                matching_sprint = iteration
                break

        if not matching_sprint:
            print(f"  Issue #{issue_num} ({title}): No matching sprint for {issue_start} - {issue_end}")
            fail_count += 1
            continue

        print(f"  Issue #{issue_num} -> sprint '{matching_sprint['title']}'...", end="", flush=True)

        node_id = get_issue_node_id(issue_num)
        if not node_id:
            print(" [FAILED: could not get issue node ID]")
            fail_count += 1
            continue

        item_id = add_issue_to_project(project["id"], node_id)
        if not item_id:
            print(" [FAILED: could not add to project]")
            fail_count += 1
            continue

        result = set_sprint(project["id"], item_id, sprint_field["id"], matching_sprint["id"])
        if result:
            print(" [OK]")
            success_count += 1
        else:
            print(" [FAILED: could not set sprint]")
            fail_count += 1

    print(f"\nDone! {success_count} issues assigned, {fail_count} failed.")
    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
