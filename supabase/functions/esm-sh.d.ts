declare module 'https://esm.sh/zod@3' {
  export * from 'zod';
}

declare module 'https://esm.sh/@supabase/supabase-js@2.105.1' {
  export * from '@supabase/supabase-js';
}

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }

  function serve(handler: (req: Request) => Response | Promise<Response>): void;
}
