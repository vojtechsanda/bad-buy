import { BottomSheet, ScreenContainer } from '@shared/components';
import { Button, ButtonText } from '@shared/components/ui/button';
import { Switch } from '@shared/components/ui/switch';
import {
  Bell,
  BellOff,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  Copy,
  Home,
  Info,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Share2,
  ShoppingBag,
  Snowflake,
  Trash2,
  User,
  X,
} from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Text, View } from 'react-native';

// Brand color literals for lucide icons — kept in sync with config.ts
const C = {
  primary: '#3E8F7C',
  primaryLight: '#D9EBE5',
  accent: '#E89B7A',
  text: '#2C2A26',
  textSecondary: '#6B6660',
  textMuted: '#9A938A',
  success: '#3E8F7C',
  warning: '#E5A93C',
  danger: '#C45757',
  info: '#5B8DB8',
} as const;

// ─── helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="font-nunito-semibold text-caption uppercase tracking-widest text-typography-400">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Divider() {
  return <View className="my-2 h-px bg-outline-200" />;
}

function Swatch({ bg, label }: { bg: string; label?: string }) {
  return (
    <View className="flex-1 items-center gap-1">
      <View className={`${bg} h-8 w-full rounded-md`} />
      {label ? <Text className="font-nunito text-2xs text-typography-400">{label}</Text> : null}
    </View>
  );
}

function RadiusBox({ rounded, label }: { rounded: string; label: string }) {
  return (
    <View className="flex-1 items-center gap-1">
      <View className={`${rounded} h-12 w-full border border-primary-300 bg-primary-100`} />
      <Text className="font-nunito text-2xs text-typography-400">{label}</Text>
    </View>
  );
}

function ElevationCard({
  shadow,
  label,
  sublabel,
}: {
  shadow?: string;
  label: string;
  sublabel: string;
}) {
  return (
    <View
      className={`flex-1 items-center gap-1 rounded-lg border border-outline-100 bg-background-0 p-3 ${shadow ?? ''}`}>
      <Text className="font-nunito-semibold text-body-sm text-typography-900">{label}</Text>
      <Text className="font-nunito text-2xs text-typography-400">{sublabel}</Text>
    </View>
  );
}

function FontComparisonCard() {
  return (
    <View className="gap-3 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
      <View className="gap-1">
        <Text className="font-nunito-semibold text-body-sm text-typography-700">
          Font comparison
        </Text>
        <Text className="font-nunito text-2xs text-typography-400">
          I swear to god I think I have eye problems because I can&apos;t tell the difference
          between these two paragraphs without looking at the CSS classes. One of them is using the
          Nunito font and the other is using the system font, but I have no idea which is which.
          They look exactly the same to me. Is this a trick question? Am I going crazy? Please help.
        </Text>
      </View>

      <View className="gap-3">
        <View className="gap-2 rounded-md bg-background-50 p-3">
          <Text className=" text-2xs uppercase tracking-wider text-typography-400">
            System font
          </Text>
          <Text className="text-body text-typography-900">
            Buy less, choose well, and keep your cart intentionally small.
          </Text>
        </View>
        <View className="gap-2 rounded-md  bg-background-50 p-3">
          <Text className="font-nunito  text-2xs uppercase tracking-wider text-typography-400">
            Nunito font
          </Text>
          <Text className="font-nunito text-body text-typography-900">
            Buy less, choose well, and keep your cart intentionally small.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function Index() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ScreenContainer>
      <View className="gap-8">
        {/* ── Header ── */}
        <View className="gap-1">
          <Text className="font-nunito-extrabold text-display-lg text-primary-500">BadBuy</Text>
          <Text className="font-nunito text-body text-typography-600">
            Design system · §4 full reference
          </Text>
        </View>

        {/* ── BottomSheet test ── */}
        <Section title="BottomSheet">
          <Button variant="outline" action="primary" size="md" onPress={() => setSheetOpen(true)}>
            <ButtonText>Open bottom sheet</ButtonText>
          </Button>
          <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
            <Text className="font-nunito-bold text-heading text-typography-900">Sheet title</Text>
            <Text className="mt-2 font-nunito text-body text-typography-600">
              This is the BottomSheet component. Swipe down or tap the backdrop to close.
            </Text>
          </BottomSheet>
        </Section>

        <Divider />

        <FontComparisonCard />

        <Divider />

        {/* ── §4.2 Color Palettes ── */}
        <Section title="§4.2 Color Palettes">
          <View className="gap-4 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <View className="gap-2">
              <Text className="font-nunito-semibold text-body-sm text-typography-700">
                Primary — Sage Teal
              </Text>
              <View className="flex-row gap-1">
                <Swatch bg="bg-primary-50" label="50" />
                <Swatch bg="bg-primary-100" label="100" />
                <Swatch bg="bg-primary-300" label="300" />
                <Swatch bg="bg-primary-500" label="500" />
                <Swatch bg="bg-primary-700" label="700" />
                <Swatch bg="bg-primary-900" label="900" />
              </View>
            </View>

            <View className="gap-2">
              <Text className="font-nunito-semibold text-body-sm text-typography-700">
                Accent — Coral Peach
              </Text>
              <View className="flex-row gap-1">
                <Swatch bg="bg-accent-100" label="100" />
                <Swatch bg="bg-tertiary-300" label="300" />
                <Swatch bg="bg-accent-500" label="500" />
                <Swatch bg="bg-accent-700" label="700" />
              </View>
            </View>

            <View className="gap-2">
              <Text className="font-nunito-semibold text-body-sm text-typography-700">
                Neutrals — Warm Grays
              </Text>
              <View className="flex-row gap-1">
                <Swatch bg="bg-secondary-0" label="0" />
                <Swatch bg="bg-secondary-100" label="100" />
                <Swatch bg="bg-secondary-200" label="200" />
                <Swatch bg="bg-secondary-500" label="500" />
                <Swatch bg="bg-secondary-700" label="700" />
                <Swatch bg="bg-secondary-800" label="800" />
              </View>
            </View>

            <View className="gap-2">
              <Text className="font-nunito-semibold text-body-sm text-typography-700">
                Semantic
              </Text>
              <View className="flex-row gap-1">
                <Swatch bg="bg-success-500" label="success" />
                <Swatch bg="bg-warning-500" label="warning" />
                <Swatch bg="bg-error-500" label="danger" />
                <Swatch bg="bg-info-500" label="info" />
              </View>
            </View>

            <View className="gap-2">
              <Text className="font-nunito-semibold text-body-sm text-typography-700">
                Celebrate — Skip page only
              </Text>
              <View className="flex-row gap-1">
                <Swatch bg="bg-celebrate-yellow" label="yellow" />
                <Swatch bg="bg-celebrate-pink" label="pink" />
                <Swatch bg="bg-celebrate-teal" label="teal" />
              </View>
            </View>
          </View>
        </Section>

        <Divider />

        {/* ── §4.3 Typography Scale ── */}
        <Section title="§4.3 Typography Scale">
          <View className="gap-3 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-extrabold text-display-xl text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                display-xl · 36/44 · 800
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-extrabold text-display-lg text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                display-lg · 28/36 · 800
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-bold text-display-md text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                display-md · 22/30 · 700
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-bold text-heading text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                heading · 18/26 · 700
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-semibold text-body-lg text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                body-lg · 16/24 · 600
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito text-body text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                body · 15/22 · 400
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito text-body-sm text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                body-sm · 13/20 · 400
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-semibold text-caption text-typography-900">Aa</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                caption · 11/16 · 600
              </Text>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className="font-nunito-semibold text-mono text-typography-900">REF-4829</Text>
              <Text className="font-nunito text-body-sm text-typography-400">
                mono · 14/22 · 600
              </Text>
            </View>

            <View className="my-1 h-px bg-outline-100" />
            <Text className="font-nunito text-body text-typography-900">
              Primary body text (#2C2A26)
            </Text>
            <Text className="font-nunito text-body text-typography-600">
              Secondary / captions (#6B6660)
            </Text>
            <Text className="font-nunito text-body text-typography-400">
              Placeholder / disabled (#9A938A)
            </Text>
            <View className="rounded-md bg-primary-500 px-3 py-2">
              <Text className="font-nunito text-body text-typography-0">
                Inverse on filled (#FBF9F5)
              </Text>
            </View>
          </View>
        </Section>

        <Divider />

        {/* ── §4.4 Spacing Scale ── */}
        <Section title="§4.4 Spacing Scale (4px base)">
          <View className="gap-2 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            {(
              [
                ['1', 'w-1', '4px'],
                ['2', 'w-2', '8px'],
                ['3', 'w-3', '12px'],
                ['4', 'w-4', '16px'],
                ['5', 'w-5', '20px'],
                ['6', 'w-6', '24px'],
                ['8', 'w-8', '32px'],
                ['10', 'w-10', '40px'],
                ['12', 'w-12', '48px'],
                ['16', 'w-16', '64px'],
                ['20', 'w-20', '80px'],
              ] as const
            ).map(([token, cls, px]) => (
              <View key={token} className="flex-row items-center gap-3">
                <Text className="w-6 font-nunito text-2xs text-typography-400">{token}</Text>
                <View className={`${cls} h-4 rounded-sm bg-primary-300`} />
                <Text className="font-nunito text-2xs text-typography-400">{px}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Divider />

        {/* ── §4.5 Border Radius ── */}
        <Section title="§4.5 Border Radius">
          <View className="rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <View className="flex-row gap-2">
              <RadiusBox rounded="rounded-sm" label="sm · 8" />
              <RadiusBox rounded="rounded-md" label="md · 12" />
              <RadiusBox rounded="rounded-lg" label="lg · 20" />
              <RadiusBox rounded="rounded-xl" label="xl · 28" />
              <RadiusBox rounded="rounded-full" label="full" />
            </View>
          </View>
        </Section>

        <Divider />

        {/* ── §4.6 Shadows / Elevation ── */}
        <Section title="§4.6 Shadows / Elevation">
          <View className="flex-row gap-3">
            <ElevationCard label="flat" sublabel="no shadow" />
            <ElevationCard shadow="shadow-raised" label="raised" sublabel="cards / lists" />
            <ElevationCard shadow="shadow-floating" label="floating" sublabel="sheets / input" />
          </View>
        </Section>

        <Divider />

        {/* ── §4.8 Buttons — Actions ── */}
        <Section title="§4.8 Buttons — Actions">
          <View className="gap-3">
            <Button variant="solid" action="primary" size="md">
              <ButtonText>Primary — Skip</ButtonText>
            </Button>
            <Button variant="solid" action="secondary" size="md">
              <ButtonText>Secondary — Freeze</ButtonText>
            </Button>
            <Button variant="solid" action="positive" size="md">
              <ButtonText>Positive — Confirm</ButtonText>
            </Button>
            <Button variant="solid" action="negative" size="md">
              <ButtonText>Negative — Delete</ButtonText>
            </Button>
          </View>
        </Section>

        <Section title="§4.8 Buttons — Variants (primary action)">
          <View className="gap-3">
            <Button variant="solid" action="primary" size="md">
              <ButtonText>Solid</ButtonText>
            </Button>
            <Button variant="outline" action="primary" size="md">
              <ButtonText>Outline</ButtonText>
            </Button>
            <Button variant="link" action="primary" size="md">
              <ButtonText>Link</ButtonText>
            </Button>
          </View>
        </Section>

        <Section title="§4.8 Buttons — Sizes">
          <View className="gap-3">
            <Button variant="solid" action="primary" size="xs">
              <ButtonText>XS</ButtonText>
            </Button>
            <Button variant="solid" action="primary" size="sm">
              <ButtonText>SM</ButtonText>
            </Button>
            <Button variant="solid" action="primary" size="md">
              <ButtonText>MD</ButtonText>
            </Button>
            <Button variant="solid" action="primary" size="lg">
              <ButtonText>LG</ButtonText>
            </Button>
            <Button variant="solid" action="primary" size="xl">
              <ButtonText>XL</ButtonText>
            </Button>
          </View>
        </Section>

        <Divider />

        {/* ── §4.8 Switch ── */}
        <Section title="§4.8 Switch — Sizes">
          <View className="gap-4 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <View className="flex-row items-center justify-between">
              <Text className="font-nunito text-body text-typography-900">SM · Notifications</Text>
              <Switch size="sm" defaultValue={true} />
            </View>
            <View className="h-px bg-outline-100" />
            <View className="flex-row items-center justify-between">
              <Text className="font-nunito text-body text-typography-900">MD · Dark mode (v2)</Text>
              <Switch size="md" defaultValue={false} />
            </View>
            <View className="h-px bg-outline-100" />
            <View className="flex-row items-center justify-between">
              <Text className="font-nunito text-body text-typography-900">LG · Disabled</Text>
              <Switch size="lg" defaultValue={false} isDisabled />
            </View>
          </View>
        </Section>

        <Divider />

        {/* ── Semantic Backgrounds ── */}
        <Section title="§4.2 Semantic Backgrounds">
          <View className="gap-2">
            <View className="flex-row gap-2">
              <View className="flex-1 rounded-md bg-background-success p-3">
                <Text className="font-nunito-semibold text-caption text-success-700">SAVED</Text>
                <Text className="font-nunito-bold text-heading text-success-900">$420</Text>
              </View>
              <View className="flex-1 rounded-md bg-background-warning p-3">
                <Text className="font-nunito-semibold text-caption text-warning-700">EXPIRES</Text>
                <Text className="font-nunito-bold text-heading text-warning-900">3 days</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 rounded-md bg-background-error p-3">
                <Text className="font-nunito-semibold text-caption text-error-700">DANGER</Text>
                <Text className="font-nunito-bold text-heading text-error-900">Delete</Text>
              </View>
              <View className="flex-1 rounded-md bg-background-info p-3">
                <Text className="font-nunito-semibold text-caption text-info-700">INFO</Text>
                <Text className="font-nunito-bold text-heading text-info-900">Tip</Text>
              </View>
            </View>
            <View className="rounded-md bg-background-muted p-3">
              <Text className="font-nunito-semibold text-caption text-typography-500">MUTED</Text>
              <Text className="font-nunito text-body text-typography-600">
                Empty state or supplemental surface
              </Text>
            </View>
          </View>
        </Section>

        {/* ── Surface Scale ── */}
        <Section title="§4.2 Background / Surface Scale">
          <View className="gap-2">
            <View className="rounded-lg border border-outline-200 bg-background-0 p-3">
              <Text className="font-nunito text-body-sm text-typography-600">
                background-0 · #FFFFFF · Card surface
              </Text>
            </View>
            <View className="rounded-lg border border-outline-200 bg-background-50 p-3">
              <Text className="font-nunito text-body-sm text-typography-600">
                background-50 · #FBF9F5 · App background
              </Text>
            </View>
            <View className="rounded-lg border border-outline-200 bg-background-100 p-3">
              <Text className="font-nunito text-body-sm text-typography-600">
                background-100 · #F4F1EB · Surface-alt / nested
              </Text>
            </View>
          </View>
        </Section>

        <Divider />

        {/* ── §4.7 Iconography ── */}
        <Section title="§4.7 Iconography">
          {/* Full icon set from the spec */}
          <View className="rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <Text className="mb-3 font-nunito-semibold text-body-sm text-typography-700">
              All app icons · size 20 · strokeWidth 1.75
            </Text>
            <View className="flex-row flex-wrap">
              {(
                [
                  [Home, 'Home'],
                  [Snowflake, 'Snowflake'],
                  [User, 'User'],
                  [Bell, 'Bell'],
                  [BellOff, 'BellOff'],
                  [ChevronLeft, 'ChevronLeft'],
                  [ChevronDown, 'ChevronDown'],
                  [X, 'X'],
                  [Plus, 'Plus'],
                  [Check, 'Check'],
                  [Pencil, 'Pencil'],
                  [Info, 'Info'],
                  [Lock, 'Lock'],
                  [RefreshCw, 'RefreshCw'],
                  [Copy, 'Copy'],
                  [Share2, 'Share2'],
                  [ShoppingBag, 'ShoppingBag'],
                  [Snowflake, 'Freeze'],
                  [Clock, 'Clock'],
                  [LogOut, 'LogOut'],
                  [Trash2, 'Trash2'],
                ] as const
              ).map(([Icon, name]) => (
                <View key={name} className="w-1/4 items-center gap-1 px-1 py-3">
                  <Icon size={20} strokeWidth={1.75} color={C.primary} />
                  <Text className="text-center font-nunito text-2xs text-typography-400">
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Size comparison */}
          <View className="gap-3 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <Text className="font-nunito-semibold text-body-sm text-typography-700">
              Size scale · Home icon
            </Text>
            <View className="flex-row items-end gap-6">
              <View className="items-center gap-2">
                <Home size={16} strokeWidth={1.75} color={C.primary} />
                <Text className="font-nunito text-2xs text-typography-400">16</Text>
              </View>
              <View className="items-center gap-2">
                <Home size={20} strokeWidth={1.75} color={C.primary} />
                <Text className="font-nunito text-2xs text-typography-400">20 default</Text>
              </View>
              <View className="items-center gap-2">
                <Home size={24} strokeWidth={1.75} color={C.primary} />
                <Text className="font-nunito text-2xs text-typography-400">24</Text>
              </View>
              <View className="items-center gap-2">
                <Home size={32} strokeWidth={1.75} color={C.primary} />
                <Text className="font-nunito text-2xs text-typography-400">32</Text>
              </View>
            </View>
          </View>

          {/* Color variants */}
          <View className="gap-3 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <Text className="font-nunito-semibold text-body-sm text-typography-700">
              Color variants · Bell icon
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {(
                [
                  [C.primary, 'primary'],
                  [C.accent, 'accent'],
                  [C.text, 'text'],
                  [C.textSecondary, 'secondary'],
                  [C.textMuted, 'muted'],
                  [C.success, 'success'],
                  [C.warning, 'warning'],
                  [C.danger, 'danger'],
                  [C.info, 'info'],
                ] as const
              ).map(([color, label]) => (
                <View key={label} className="items-center gap-1">
                  <Bell size={20} strokeWidth={1.75} color={color} />
                  <Text className="font-nunito text-2xs text-typography-400">{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Icons in context — button with icon */}
          <View className="gap-3 rounded-lg border border-outline-200 bg-background-0 p-4 shadow-raised">
            <Text className="font-nunito-semibold text-body-sm text-typography-700">
              Icons in context
            </Text>
            <View className="gap-2">
              <Button variant="solid" action="primary" size="md">
                <ShoppingBag size={18} strokeWidth={1.75} color="#FEFEFE" />
                <ButtonText>Buy anyway</ButtonText>
              </Button>
              <Button variant="outline" action="primary" size="md">
                <Snowflake size={18} strokeWidth={1.75} color={C.primary} />
                <ButtonText>Freeze for later</ButtonText>
              </Button>
              <Button variant="solid" action="negative" size="md">
                <Trash2 size={18} strokeWidth={1.75} color="#FEFEFE" />
                <ButtonText>Delete account</ButtonText>
              </Button>
            </View>
          </View>
        </Section>
      </View>
    </ScreenContainer>
  );
}
