import { mount, signal, Scroll, Text, View } from "nsh";
import { checkForPackage, downloadPackage, runningPackage, shellInfo } from "nsh/updater";
import { TOPICS, type ReadItem, type Topic } from "./topics";

// Lastbook mobile — UI v0.2: tema token (light/dark otomatis), class Tailwind,
// press feedback active:scale (emil-design-eng), tipografi & ritme konsisten.

const ICON: Record<string, string> = {
  comms: "📡", disaster: "🚨", energy: "🔋", food: "🍲", grow: "🌱",
  health: "🩺", hurt: "🩹", land: "🗺️", power: "💡", preserve: "🫙",
  repair: "🔧", sanitation: "🧼", shelter: "🏠", water: "💧",
};
const ACCENT: Record<string, string> = {
  comms: "#0969da", disaster: "#cf222e", energy: "#bf8700", food: "#1a7f37",
  grow: "#1a7f37", health: "#8250df", hurt: "#cf222e", land: "#326d74",
  power: "#bf8700", preserve: "#1a7f37", repair: "#6e7781", sanitation: "#326d74",
  shelter: "#953800", water: "#0969da",
};

function ReadingRow(props: { item: ReadItem }) {
  return (
    <View class="py-2" style={{ gap: 2 }}>
      <Text class="text-[15px] font-semibold text-foreground">{props.item.label}</Text>
      {props.item.note ? <Text class="text-xs text-muted-foreground">{props.item.note}</Text> : null}
      {props.item.page ? (
        <Text class="text-[11px] text-muted-foreground/70">📄 hal. {props.item.page}</Text>
      ) : null}
    </View>
  );
}

function Card(props: { icon?: string; title: string; hint: string; onPress: () => void; accent?: string }) {
  return (
    <View
      onPress={props.onPress}
      class="bg-card rounded-(--radius-card) border border-border border-l-4 p-3.5 transition-transform duration-150 ease-out active:scale-[0.97] active:bg-accent"
      style={{ borderLeftColor: props.accent, gap: 3 }}
    >
      <View class="flex-row items-center" style={{ gap: 8 }}>
        {props.icon ? <Text class="text-xl">{props.icon}</Text> : null}
        <Text class="text-base font-bold text-foreground">{props.title}</Text>
      </View>
      {props.hint ? <Text class="text-xs text-muted-foreground">{props.hint}</Text> : null}
    </View>
  );
}

function SectionTitle(props: { children: string; tone?: "plain" | "danger" }) {
  return (
    <Text class={props.tone === "danger" ? "text-lg font-bold text-destructive" : "text-lg font-bold text-foreground"}>
      {props.children}
    </Text>
  );
}

const SHELL = shellInfo();
const PKG = runningPackage();

function App() {
  const selected = signal<string | null>(null);
  const expanded = signal<string | null>(null);
  const upd = signal<"idle" | "busy" | "ready" | "error">("idle");
  const updMsg = signal<string>("");

  async function checkUpdates() {
    if (upd() === "busy") return;
    try {
      upd.set("busy");
      updMsg.set("Memeriksa…");
      const pkg = await checkForPackage();
      if (!pkg) {
        upd.set("idle");
        updMsg.set(`Sudah terbaru (shell v${SHELL?.version ?? "—"})`);
        return;
      }
      updMsg.set(`Versi ${pkg.version} tersedia. Mengunduh…`);
      await downloadPackage();
      upd.set("ready");
      updMsg.set("Paket siap. Tutup paksa aplikasi, lalu buka lagi.");
    } catch (e) {
      upd.set("error");
      updMsg.set(`Gagal: ${String(e)}`);
    }
  }

  const topic = (): Topic | undefined => TOPICS.find((t) => t.id === selected());

  const Home = () => (
    <Scroll class="flex-1 bg-background">
      <View class="p-5 gap-4" style={{ paddingTop: 56 }}>
        <View class="flex-row items-center" style={{ gap: 12 }}>
          <View class="w-11 h-11 rounded-(--radius-card) bg-primary items-center justify-center">
            <Text class="text-2xl">📖</Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text class="text-3xl font-bold tracking-tight text-foreground">Lastbook</Text>
            <Text class="text-xs text-muted-foreground">Survival library — offline & private</Text>
          </View>
        </View>

        <View class="gap-2.5">
          <Each of={TOPICS}>
            {(t) => (
              <Card
                icon={ICON[t().id] ?? "📖"}
                title={t().title}
                hint={t().short ?? ""}
                accent={ACCENT[t().id]}
                onPress={() => { expanded.set(null); selected.set(t().id); }}
              />
            )}
          </Each>
        </View>

        <View class="gap-1.5">
          <SectionTitle>Pembaruan</SectionTitle>
          <View class="bg-card rounded-(--radius-card) border border-border p-3.5" style={{ gap: 8 }}>
            <Text class="text-xs text-muted-foreground">
              Shell v{SHELL?.version ?? "—"}
              {PKG ? ` · paket ${PKG.version} berjalan` : ""}
            </Text>
            <View
              onPress={checkUpdates}
              class="self-start rounded-(--radius) bg-primary px-3.5 py-2 transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <Text class="text-sm font-semibold text-primary-foreground">
                {upd() === "busy" ? "Memeriksa…" : "Periksa pembaruan"}
              </Text>
            </View>
            {updMsg() ? <Text class="text-xs text-muted-foreground">{updMsg()}</Text> : null}
          </View>
        </View>

        <Text class="text-[11px] text-muted-foreground/70">
          Data topik asli dari lastbook (MIT). Pembacaan PDF & peta menyusul.
        </Text>
      </View>
    </Scroll>
  );

  const Detail = (props: { t: Topic }) => (
    <Scroll class="flex-1 bg-background">
      <View class="p-5 gap-4" style={{ paddingTop: 44 }}>
        <View
          onPress={() => { expanded.set(null); selected.set(null); }}
          class="-ml-1 py-1.5 self-start transition-opacity duration-150 active:opacity-60"
        >
          <Text class="text-[15px] font-semibold text-primary">‹ Semua topik</Text>
        </View>

        <View style={{ gap: 4 }}>
          <View class="flex-row items-center" style={{ gap: 8 }}>
            <Text class="text-xl">{ICON[props.t.id] ?? "📖"}</Text>
            <Text class="text-2xl font-bold tracking-tight text-foreground">{props.t.title}</Text>
          </View>
          {props.t.intro ? <Text class="text-sm text-muted-foreground">{props.t.intro}</Text> : null}
        </View>

        {props.t.choices ? (
          <View class="gap-2.5">
            <SectionTitle>What's happening?</SectionTitle>
            <Each of={props.t.choices}>
              {(c) => (
                <View class="gap-2.5">
                  <Card
                    title={c().label}
                    hint={c().hint ?? ""}
                    accent={ACCENT[props.t.id]}
                    onPress={() => expanded.set(expanded() === c().id ? null : c().id)}
                  />
                  {expanded() === c().id ? (
                    <View class="bg-muted rounded-(--radius) p-3">
                      <Each of={c().read}>{(r) => <ReadingRow item={r()} />}</Each>
                    </View>
                  ) : null}
                </View>
              )}
            </Each>
          </View>
        ) : null}

        {props.t.limits?.length ? (
          <View class="gap-1.5">
            <SectionTitle tone="danger">Limits</SectionTitle>
            <Each of={props.t.limits}>{(l) => (
              <Text class="text-[13px] text-muted-foreground">• {l().text}</Text>
            )}</Each>
          </View>
        ) : null}

        {props.t.prepare?.length ? (
          <View class="gap-1.5">
            <SectionTitle>Prepare</SectionTitle>
            <Each of={props.t.prepare}>{(r) => <ReadingRow item={r()} />}</Each>
          </View>
        ) : null}

        {props.t.learn?.length ? (
          <View class="gap-1.5">
            <SectionTitle>Learn</SectionTitle>
            <Each of={props.t.learn}>{(r) => <ReadingRow item={r()} />}</Each>
          </View>
        ) : null}
      </View>
    </Scroll>
  );

  // Branch reaktif: signal dibaca DI DALAM ekspresi JSX, bukan di badan komponen.
  return <View class="flex-1">{topic() ? <Detail t={topic()!} /> : <Home />}</View>;
}

mount(App);
