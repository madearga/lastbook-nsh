import { batch, Canvas, type CanvasRenderingContext2D, computed, createMotion, effect, Image, mount, PanResponder, reduceMotion, Scroll, signal, Storage, Text, View, windowSize } from "nsh";
import type { ScrollRef } from "nsh";
import { t as ti, setLocale } from "nsh/i18n";
import { Collapsible, Input } from "nsh/base";
import { BackHandler, Haptics } from "nsh/mobile";
import { checkForPackage, downloadPackage, runningPackage, shellInfo } from "nsh/updater";
import { TOPICS, type Choice, type ReadItem, type Topic } from "./topics";
import { bookOf, type Book } from "./readers";
import { catalogue, download, pack, remove, saved, type MapName, type MapPack, type MapRegion } from "./maps";

// Lastbook mobile — UI v0.5: dua bahasa (nsh/i18n, locales/app.yml), pembaca PDF
// navigasi bagian, kartu situasi yang membuka dengan pegas, ukuran teks baca,
// riwayat "terakhir dibuka" (Storage), tombol kembali Android. Semua warna dari
// token tema (theme.json, terang & gelap). Konten topik tetap bahasa Inggris.

// ---------------------------------------------------------------------------
// Data UI (bukan konten): ikon, warna, nama & kata kunci Indonesia per topik.

type Tone = "blue" | "red" | "amber" | "green" | "violet" | "teal" | "slate" | "brown";

// Kelas statis penuh (bukan string rakitan) supaya `nsh build` bisa memeriksanya.
const TONE: Record<Tone, { bar: string; tile: string; text: string }> = {
  blue: { bar: "border-l-tone-blue", tile: "bg-tone-blue/15", text: "text-tone-blue" },
  red: { bar: "border-l-tone-red", tile: "bg-tone-red/15", text: "text-tone-red" },
  amber: { bar: "border-l-tone-amber", tile: "bg-tone-amber/15", text: "text-tone-amber" },
  green: { bar: "border-l-tone-green", tile: "bg-tone-green/15", text: "text-tone-green" },
  violet: { bar: "border-l-tone-violet", tile: "bg-tone-violet/15", text: "text-tone-violet" },
  teal: { bar: "border-l-tone-teal", tile: "bg-tone-teal/15", text: "text-tone-teal" },
  slate: { bar: "border-l-tone-slate", tile: "bg-tone-slate/15", text: "text-tone-slate" },
  brown: { bar: "border-l-tone-brown", tile: "bg-tone-brown/15", text: "text-tone-brown" },
};

type Meta = { icon: string; tone: Tone; name: { id: string; en: string }; keys: string };

const META: Record<string, Meta> = {
  comms: { icon: "📡", tone: "blue", name: { id: "Komunikasi & arah", en: "Comms & navigation" }, keys: "komunikasi radio telepon hp sinyal internet keluarga kabar peta kompas arah navigasi tersesat" },
  disaster: { icon: "🚨", tone: "red", name: { id: "Bencana alam", en: "Disaster survival" }, keys: "bencana gempa badai kebakaran api banjir tsunami angin topan puting beliung asap evakuasi petir" },
  energy: { icon: "🔋", tone: "amber", name: { id: "Energi", en: "Energy" }, keys: "energi listrik surya matahari baterai aki generator panel" },
  food: { icon: "🍲", tone: "green", name: { id: "Makanan", en: "Food safety" }, keys: "makanan makan masak memasak kulkas basi lapar" },
  grow: { icon: "🌱", tone: "green", name: { id: "Bercocok tanam", en: "Gardening" }, keys: "tanam menanam kebun bibit benih pangan tani pertanian sayur hama" },
  health: { icon: "🩺", tone: "violet", name: { id: "Kesehatan", en: "Health" }, keys: "kesehatan obat penyakit kronis dokter sakit" },
  hurt: { icon: "🩹", tone: "red", name: { id: "Cedera & sakit", en: "Injuries & illness" }, keys: "luka cedera sakit darurat pertolongan pertama p3k darah berdarah patah pingsan demam syok" },
  land: { icon: "🗺️", tone: "teal", name: { id: "Lahan & sumber daya", en: "Land & resources" }, keys: "lahan tanah sumber alam lokasi kayu hutan" },
  power: { icon: "💡", tone: "amber", name: { id: "Listrik padam", en: "Power outage" }, keys: "listrik padam mati lampu senter penerangan cas baterai hp" },
  preserve: { icon: "🥫", tone: "green", name: { id: "Pengawetan", en: "Food preservation" }, keys: "awet awetkan pengawetan simpan penyimpanan makanan kaleng kering asin" },
  repair: { icon: "🔧", tone: "slate", name: { id: "Perbaikan", en: "Repair & build" }, keys: "perbaiki perbaikan bangun alat rumah tukang" },
  sanitation: { icon: "🧼", tone: "teal", name: { id: "Sanitasi", en: "Sanitation" }, keys: "toilet jamban sanitasi kebersihan sampah limbah cuci tangan sabun" },
  shelter: { icon: "🏠", tone: "brown", name: { id: "Tempat berlindung", en: "Shelter" }, keys: "tempat tinggal berlindung berteduh hangat dingin panas tenda rumah selimut" },
  water: { icon: "💧", tone: "blue", name: { id: "Air minum", en: "Drinking water" }, keys: "air minum bersih rebus saring sumur hujan haus" },
};
const FALLBACK: Meta = { icon: "📖", tone: "slate", name: { id: "Topik", en: "Topic" }, keys: "" };
const meta = (id: string): Meta => META[id] ?? FALLBACK;
const mname = (m: Meta) => (langPref() === "en" ? m.name.en : m.name.id);

// Pembaca PDF: dokumen harus punya halaman yang sudah dirender di registry.
const canRead = (item: ReadItem) => {
  const b = bookOf(item.doc ?? "");
  return !!b && typeof item.page === "number" && b.pages.some((p) => p.n === item.page);
};

const SUGGESTIONS = ["air", "luka", "gempa", "listrik", "makanan"];
const PREFS_KEY = "lastbook.prefs";

// Kurva ease-out kuat (emil-design-eng): mulai cepat, terasa responsif.
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ---------------------------------------------------------------------------
// Pencarian: setiap kata kueri harus cocok dengan awal sebuah kata di topik
// (judul, ringkasan, nama & kata kunci Indonesia, situasi, intro, batasan).
// Awal kata, bukan substring: "air" menemukan air minum, bukan "repair".

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const words = (s: string) => fold(s).split(/[^a-z0-9]+/).filter(Boolean);
const hit = (ws: string[], q: string) => ws.some((w) => w.startsWith(q));

type Result = { t: Topic; score: number; via?: Choice };

const INDEX = TOPICS.map((t) => {
  const m = meta(t.id);
  const head = words(`${t.title} ${t.short ?? ""} ${m.name} ${m.keys}`);
  const choices = (t.choices ?? []).map((c) => ({ c, w: words(`${c.label} ${c.hint ?? ""}`) }));
  const body = words(`${t.intro ?? ""} ${(t.limits ?? []).map((l) => l.text).join(" ")}`);
  return { t, head, choices, all: [...head, ...choices.flatMap((c) => c.w), ...body] };
});

function search(query: string): Result[] {
  const qs = words(query);
  if (!qs.length) return TOPICS.map((t) => ({ t, score: 0 }));
  const out: Result[] = [];
  for (const ix of INDEX) {
    if (!qs.every((q) => hit(ix.all, q))) continue;
    const headHits = qs.filter((q) => hit(ix.head, q)).length;
    // Situasi yang menjelaskan kecocokan: kata yang tidak ada di judul ada di situasi ini.
    const via = headHits === qs.length
      ? undefined
      : ix.choices.find((c) => qs.every((q) => hit(c.w, q) || hit(ix.head, q)))?.c;
    out.push({ t: ix.t, score: headHits * 2 + (via ? 1 : 0), via });
  }
  return out.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------

const SHELL = shellInfo();
const PKG = runningPackage();
// Pilihan bahasa pengguna ("id" | "en" | null = ikut perangkat) — sinkron dengan nsh/i18n setLocale.
const langPref = signal<"id" | "en" | null>(null);

function App() {
  const selected = signal<string | null>(null);
  const expanded = signal<string | null>(null);
  const query = signal("");
  const large = signal(false);
  const recent = signal<string[]>([]);
  const loaded = signal(false);
  const upd = signal<"idle" | "busy" | "ready" | "error">("idle");
  const updMsg = signal<string>("");
  const reader = signal<{ doc: string; page: number } | null>(null);
  // Peta offline: katalog, peta tersimpan di perangkat, dan peta yang sedang dibuka.
  const mapsOpen = signal(false);
  const regions = signal<MapRegion[] | null>(null);
  const catErr = signal("");
  const onDevice = signal<Record<string, number>>({});
  const openMap = signal<MapRegion | null>(null);
  const mapData = signal<MapPack | null>(null);
  const mapErr = signal("");
  const mapBusy = signal<string | null>(null);
  const mapPan = signal({ x: 0, y: 0 });
  const mapZoom = signal(1);

  // Preferensi di perangkat: ukuran teks & riwayat. Ditulis hanya setelah dibaca.
  Storage.getItem(PREFS_KEY)
    .then((raw) => {
      const p = JSON.parse(raw ?? "{}");
      if (p.lang === "id" || p.lang === "en") {
        langPref.set(p.lang);
        setLocale(p.lang);
      }
      if (typeof p.large === "boolean") large.set(p.large);
      if (Array.isArray(p.recent)) {
        recent.set(p.recent.filter((id: unknown) => typeof id === "string" && id in META).slice(0, 3));
      }
    })
    .catch(() => {})
    .finally(() => loaded.set(true));
  saved()
    .then((x) => onDevice.set(x))
    .catch(() => {});
  effect(() => {
    const prefs = JSON.stringify({ lang: langPref(), large: large(), recent: recent() });
    if (loaded()) Storage.setItem(PREFS_KEY, prefs).catch(() => {});
  });

  function openTopic(id: string, choice: string | null = null) {
    batch(() => {
      expanded.set(choice);
      selected.set(id);
      recent.update((r) => [id, ...r.filter((x) => x !== id)].slice(0, 3));
    });
  }
  function goHome() {
    batch(() => {
      expanded.set(null);
      selected.set(null);
    });
  }
  // Android: tombol/gestur kembali menutup topik dulu, baru keluar aplikasi.
  BackHandler.on("press", () => {
    if (openMap() != null) {
      openMap.set(null);
      mapData.set(null);
      mapPan.set({ x: 0, y: 0 });
      mapZoom.set(1);
      return true;
    }
    if (mapsOpen()) {
      mapsOpen.set(false);
      return true;
    }
    if (reader() != null) {
      reader.set(null);
      return true;
    }
    if (!selected()) return false;
    goHome();
    return true;
  });

  async function checkUpdates() {
    if (upd() === "busy") return;
    try {
      upd.set("busy");
      updMsg.set(ti("updates.checking"));
      const pkg = await checkForPackage();
      if (!pkg) {
        upd.set("idle");
        updMsg.set(ti("updates.up_to_date", { v: SHELL?.version ?? "—" }));
        return;
      }
      updMsg.set(ti("updates.available", { v: pkg.version }));
      await downloadPackage();
      upd.set("ready");
      updMsg.set(ti("updates.ready"));
    } catch (e) {
      upd.set("error");
      updMsg.set(`${ti("updates.failed")} ${String(e)}`);
    }
  }

  async function openMaps() {
    Haptics.selection();
    mapsOpen.set(true);
    onDevice.set(await saved().catch(() => ({})));
    if (regions() == null) await loadCatalogue();
  }
  async function loadCatalogue() {
    try {
      catErr.set("");
      regions.set(await catalogue());
    } catch (e) {
      catErr.set(String(e));
    }
  }
  async function saveMap(r: MapRegion) {
    if (mapBusy() != null) return;
    try {
      mapBusy.set(r.id);
      mapErr.set("");
      await download(r);
      onDevice.set(await saved());
      Haptics.selection();
      await showMap(r);
    } catch (e) {
      // Tetap di daftar: galat unduhan bukan galat peta.
      mapErr.set(`${ti("maps.failed")} ${String(e)}`);
    } finally {
      mapBusy.set(null);
    }
  }
  async function showMap(r: MapRegion) {
    try {
      mapErr.set("");
      mapData.set(null);
      openMap.set(r);
      mapPan.set({ x: 0, y: 0 });
      mapZoom.set(1);
      mapData.set(await pack(r));
    } catch (e) {
      mapErr.set(`${ti("maps.failed")} ${String(e)}`);
    }
  }
  async function dropMap(r: MapRegion) {
    await remove(r).catch(() => {});
    onDevice.set(await saved());
  }

  const topic = (): Topic | undefined => TOPICS.find((t) => t.id === selected());
  const results = computed(() => search(query()));
  const searching = () => words(query()).length > 0;

  // Ukuran teks baca (tombol "Aa"): isi panjang tetap nyaman di bawah tekanan.
  const bodyText = () => (large() ? "text-[18px] leading-[29px]" : "text-[16px] leading-[25px]");
  const smallText = () => (large() ? "text-[16px] leading-[25px]" : "text-[14px] leading-[21px]");

  // -------------------------------------------------------------------------
  // Beranda

  const TopicCard = (props: { r: Result }) => {
    const m = () => meta(props.r.t.id);
    const tone = () => TONE[m().tone];
    return (
      <View
        role="button"
        onPress={() => openTopic(props.r.t.id, props.r.via?.id ?? null)}
        class={`flex-row items-center gap-3.5 bg-card rounded-(--radius-card) border border-border border-l-4 ${tone().bar} p-4 transition duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] active:bg-accent`}
      >
        <View class={`w-11 h-11 rounded-(--radius) items-center justify-center ${tone().tile}`}>
          <Text class="text-[22px]">{m().icon}</Text>
        </View>
        <View class="flex-1 gap-1">
          <Text class={`text-[11px] font-bold uppercase tracking-wider ${tone().text}`}>{mname(m())}</Text>
          <Text class="text-[16px] leading-[21px] font-bold text-foreground">{props.r.t.title}</Text>
          {props.r.t.short ? (
            <Text class="text-[13px] leading-[18px] text-muted-foreground line-clamp-2">{props.r.t.short}</Text>
          ) : null}
          {props.r.via ? (
            <Text class="text-[13px] leading-[18px] font-semibold text-primary">{`${ti("home.match")} ${props.r.via.label}`}</Text>
          ) : null}
        </View>
        <Text class="text-2xl text-muted-foreground/60">›</Text>
      </View>
    );
  };

  const Group = (props: { title: string; note: string; items: Result[] }) => (
    <If when={props.items.length > 0}>
      <View class="gap-2.5">
        <View class="flex-row items-baseline justify-between">
          <Text class="text-[13px] font-bold uppercase tracking-wider text-foreground">{props.title}</Text>
          <Text class="text-xs text-muted-foreground">{props.note}</Text>
        </View>
        <Each of={props.items} key={(r: Result) => r.t.id}>
          {(r) => <TopicCard r={r()} />}
        </Each>
      </View>
    </If>
  );

  const EmptyResults = () => (
    <View class="items-center gap-3 py-10 px-4 bg-card rounded-(--radius-card) border border-dashed border-input">
      <Text class="text-4xl">🧭</Text>
      <Text class="text-[17px] font-bold text-foreground text-center">{ti("home.no_results", { q: query().trim() })}</Text>
      <Text class="text-[14px] leading-[21px] text-muted-foreground text-center">
        {ti("home.no_results_hint")}
      </Text>
      <View class="flex-row flex-wrap justify-center gap-2">
        <Each of={SUGGESTIONS}>
          {(s) => (
            <View
              role="button"
              onPress={() => query.set(s())}
              class="h-9 px-3.5 rounded-(--radius-pill) bg-secondary border border-border items-center justify-center transition duration-150 ease-out active:scale-[0.97] active:bg-accent"
            >
              <Text class="text-sm font-semibold text-foreground">{s()}</Text>
            </View>
          )}
        </Each>
      </View>
      <View
        role="button"
        onPress={() => query.set("")}
        class="mt-1 h-10 px-4 rounded-(--radius) bg-primary items-center justify-center transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        <Text class="text-sm font-semibold text-primary-foreground">{ti("home.clear_search")}</Text>
      </View>
    </View>
  );

  const Home = () => (
    <Scroll class="flex-1 bg-background" keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
      <View class="w-full max-w-[680px] self-center px-5 pb-12 gap-5 pt-[calc(env(safe-area-inset-top)+20px)]">
        <View class="flex-row items-center gap-3">
          <View class="w-12 h-12 rounded-(--radius-card) bg-primary items-center justify-center">
            <Text class="text-2xl">📖</Text>
          </View>
          <View class="flex-1 gap-0.5">
            <Text class="text-[28px] leading-[34px] font-bold tracking-tight text-foreground">Lastbook</Text>
            <Text class="text-[13px] text-muted-foreground">{ti("app.tag")}</Text>
          </View>
        </View>

        <View class="gap-2">
          <View class="flex-row items-center gap-2 h-12 pl-3.5 pr-1.5 bg-card border border-input rounded-(--radius-card) focus-within:border-ring">
            <Text class="text-base text-muted-foreground">🔍</Text>
            <Input
              class="flex-1 h-12 text-[16px] text-foreground placeholder:text-muted-foreground caret-primary"
              value={query()}
              onChange={(e) => query.set(e.value)}
              placeholder={ti("search.ph")}
              accessibilityLabel={ti("search.a11y")}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <If when={query().length > 0}>
              <View
                role="button"
                accessibilityLabel={ti("search.clear.a11y")}
                onPress={() => query.set("")}
                class="h-9 px-3 rounded-(--radius) bg-muted items-center justify-center transition-opacity duration-150 active:opacity-60"
              >
                <Text class="text-[13px] font-semibold text-muted-foreground">{ti("search.clear")}</Text>
              </View>
            </If>
          </View>
          <Text class="text-[13px] text-muted-foreground px-1">
            {searching() ? ti("search.matching", { n: results().length }) : ti("search.all_offline", { n: TOPICS.length })}
          </Text>
        </View>

        <If when={!searching() && recent().length > 0}>
          <View class="gap-2">
            <Text class="text-[13px] font-bold uppercase tracking-wider text-foreground">{ti("home.recent")}</Text>
            <View class="flex-row flex-wrap gap-2">
              <Each of={recent()}>
                {(id) => (
                  <View
                    role="button"
                    onPress={() => openTopic(id())}
                    class="flex-row items-center gap-1.5 h-10 px-3.5 rounded-(--radius-pill) bg-card border border-border transition duration-150 ease-out active:scale-[0.97] active:bg-accent"
                  >
                    <Text class="text-[15px]">{meta(id()).icon}</Text>
                    <Text class="text-sm font-semibold text-foreground">{mname(meta(id()))}</Text>
                  </View>
                )}
              </Each>
            </View>
          </View>
        </If>

        <If when={results().length > 0} else={<EmptyResults />}>
          <Group title={ti("home.group_now")} note={ti("home.group_now_note")} items={results().filter((r) => r.t.mode === "now")} />
          <Group title={ti("home.group_learn")} note={ti("home.group_learn_note")} items={results().filter((r) => r.t.mode !== "now")} />
        </If>

        <View class="gap-2 pt-2">
          <Text class="text-[13px] font-bold uppercase tracking-wider text-foreground">{ti("maps.title")}</Text>
          <View class="bg-card rounded-(--radius-card) border border-border p-4 gap-2.5">
            <Text class="text-[13px] text-muted-foreground">{ti("maps.home_note", { n: Object.keys(onDevice()).length })}</Text>
            <View
              role="button"
              onPress={openMaps}
              class="self-start h-10 px-4 rounded-(--radius) bg-primary items-center justify-center transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <Text class="text-sm font-semibold text-primary-foreground">{ti("maps.open_list")}</Text>
            </View>
          </View>
        </View>

        <View class="gap-2 pt-2">
          <Text class="text-[13px] font-bold uppercase tracking-wider text-foreground">{ti("updates.title")}</Text>
          <View class="bg-card rounded-(--radius-card) border border-border p-4 gap-2.5">
            <Text class="text-[13px] text-muted-foreground">
              {`Shell v${SHELL?.version ?? "—"}${PKG ? ti("updates.pkg_running", { v: PKG.version }) : ""}`}
            </Text>
            <View
              role="button"
              onPress={checkUpdates}
              disabled={upd() === "busy"}
              class="self-start h-10 px-4 rounded-(--radius) bg-primary items-center justify-center transition-transform duration-150 ease-out active:scale-[0.97] disabled:opacity-60"
            >
              <Text class="text-sm font-semibold text-primary-foreground">
                {upd() === "busy" ? ti("updates.checking") : ti("updates.check")}
              </Text>
            </View>
            {updMsg() ? (
              <Text class={`text-[13px] ${upd() === "error" ? "text-destructive" : "text-muted-foreground"}`}>{updMsg()}</Text>
            ) : null}
          </View>
        </View>

        <View class="gap-2">
          <Text class="text-[13px] font-bold uppercase tracking-wider text-foreground">{ti("lang.title")}</Text>
          <View class="flex-row gap-2">
            <LangButton l="id" label="Indonesia" />
            <LangButton l="en" label="English" />
          </View>
        </View>

        <Text class="text-xs leading-[18px] text-muted-foreground/80 text-center px-4">
          {ti("footer")}
        </Text>
      </View>
    </Scroll>
  );

  // -------------------------------------------------------------------------
  // Detail topik

  const ReadingRow = (props: { item: ReadItem; n?: number }) => (
    <View class="flex-row gap-3 py-3 border-b border-border last:border-b-0">
      {props.n != null ? (
        <View class="w-6 h-6 mt-0.5 rounded-(--radius-pill) bg-primary/15 items-center justify-center">
          <Text class="text-xs font-bold text-primary">{String(props.n)}</Text>
        </View>
      ) : (
        <View class="w-1.5 h-1.5 mt-2.5 rounded-full bg-muted-foreground/60" />
      )}
      <View class="flex-1 gap-1">
        <Text class={`font-semibold text-foreground ${bodyText()}`}>{props.item.label}</Text>
        {props.item.note ? <Text class={`text-muted-foreground ${smallText()}`}>{props.item.note}</Text> : null}
        {props.item.page ? (
          canRead(props.item) ? (
            <View
              role="button"
              accessibilityLabel={ti("read.open_page", { n: props.item.page ?? 0 })}
              onPress={() => {
                Haptics.selection();
                reader.set({ doc: props.item.doc ?? "", page: props.item.page ?? 1 });
              }}
              class="self-start mt-1 px-2.5 py-1 rounded-(--radius-pill) bg-primary/15 border border-primary/40 transition duration-150 ease-out active:scale-[0.97]"
            >
              <Text class="text-xs font-bold text-primary">{ti("read.open_page", { n: props.item.page ?? 0 })}</Text>
            </View>
          ) : (
            <View class="self-start mt-1 px-2 py-0.5 rounded-(--radius-pill) bg-secondary border border-border">
              <Text class="text-xs font-semibold text-muted-foreground">{ti("read.page", { n: props.item.page ?? 0 })}</Text>
            </View>
          )
        ) : null}
      </View>
    </View>
  );

  const LimitRow = (props: { text: string }) => (
    <View class="flex-row gap-2.5 py-1.5">
      <View class="w-1.5 h-1.5 rounded-full bg-destructive" style={{ marginTop: large() ? 12 : 10 }} />
      <Text class={`flex-1 text-foreground ${bodyText()}`}>{props.text}</Text>
    </View>
  );

  const Detail = (props: { t: Topic }) => {
    // Detail dibuat ulang untuk tiap topik (cabang di App), jadi `t` tetap.
    const t = props.t;
    const m = meta(t.id);
    const tone = TONE[m.tone];
    const idx = TOPICS.findIndex((x) => x.id === t.id);
    const next = TOPICS[(idx + 1) % TOPICS.length];
    const limits = t.limits ?? [];
    const LIMIT_PREVIEW = 4;

    let scroller!: ScrollRef;
    const offsets: Record<string, number> = {};
    const scrolled = signal(false);
    const allLimits = signal(false);
    // Masuk layar: pudar + naik 12pt, 220 ms ease-out (otomatis diam bila "kurangi gerakan").
    const enter = createMotion({ enter: { duration: 220, easing: EASE_OUT, keyframes: { opacity: [0, 1], translateY: [12, 0] } } });

    const sections = [
      t.choices?.length ? { id: "choices", nav: () => ti("section.choices_nav"), count: t.choices.length } : null,
      limits.length ? { id: "limits", nav: () => ti("section.limits_nav"), count: limits.length } : null,
      t.prepare?.length ? { id: "prepare", nav: () => ti("section.prepare_nav"), count: t.prepare.length } : null,
      t.learn?.length ? { id: "learn", nav: () => ti("section.learn_nav"), count: t.learn.length } : null,
    ].filter((s): s is { id: string; nav: () => string; count: number } => s !== null);

    const scrollTo = (y: number) => scroller?.scrollTo({ y: Math.max(0, y), animated: !reduceMotion() });
    const jump = (id: string) => {
      if (offsets[id] != null) scrollTo(offsets[id] - 8);
    };
    const toggle = (id: string) => {
      Haptics.selection();
      expanded.set(expanded() === id ? null : id);
    };
    const track = (id: string) => (e: { bounds: { origin: { y: number } } }) => {
      offsets[id] = e.bounds.origin.y;
    };

    const SectionHead = (p: { id: string; title: string; note: string; danger?: boolean }) => (
      <View
        role="header"
        onPress={() => jump(p.id)}
        class="gap-0.5 transition-opacity duration-150 active:opacity-60"
      >
        <Text class={`text-[20px] leading-[26px] font-bold tracking-tight ${p.danger ? "text-destructive" : "text-foreground"}`}>
          {p.title}
        </Text>
        <Text class="text-[13px] text-muted-foreground">{p.note}</Text>
      </View>
    );

    const ChoiceCard = (p: { c: Choice }) => {
      const open = () => expanded() === p.c.id;
      return (
        <Collapsible
          open={open()}
          reveal
          class={`bg-card rounded-(--radius-card) border overflow-hidden transition-colors duration-200 ${open() ? "border-primary/60" : "border-border"}`}
          content={
            <View class="px-4 pb-1 border-t border-border bg-muted/50">
              <Each of={p.c.read}>{(r, i) => <ReadingRow item={r()} n={i() + 1} />}</Each>
            </View>
          }
        >
          <View
            role="button"
            accessibilityState={{ expanded: open() }}
            onPress={() => toggle(p.c.id)}
            class="group flex-row items-center gap-3 p-4 transition-colors duration-150 active:bg-accent"
          >
            <View class="flex-1 gap-1">
              <Text class={`font-semibold text-foreground ${large() ? "text-[18px] leading-[25px]" : "text-[16px] leading-[22px]"}`}>
                {p.c.label}
              </Text>
              {p.c.hint ? <Text class={`text-muted-foreground ${smallText()}`}>{p.c.hint}</Text> : null}
            </View>
            <View class="items-center gap-0.5">
              <Text class="text-[22px] text-muted-foreground transition-transform duration-200 ease-out group-aria-expanded:rotate-90">›</Text>
              <Text class="text-[11px] font-semibold text-muted-foreground">{ti("read.count", { n: p.c.read.length })}</Text>
            </View>
          </View>
        </Collapsible>
      );
    };

    return (
      <View class="flex-1 bg-background">
        {/* Bilah atas tetap: kembali, nama topik saat menggulir, ukuran teks. */}
        <View
          class={`flex-row items-center gap-2 px-3 pb-2 bg-background border-b pt-[calc(env(safe-area-inset-top)+8px)] ${scrolled() ? "border-border" : "border-transparent"}`}
        >
          <View
            role="button"
            onPress={goHome}
            class="h-11 px-2 rounded-(--radius) justify-center transition-colors duration-150 active:bg-accent"
          >
            <Text class="text-[16px] font-semibold text-primary">{ti("detail.all_topics")}</Text>
          </View>
          <View class="flex-1 items-center">
            {scrolled() ? <Text class="text-[15px] font-semibold text-foreground line-clamp-1">{mname(m)}</Text> : null}
          </View>
          <View
            role="button"
            accessibilityLabel={ti("detail.large_text")}
            accessibilityState={{ selected: large() }}
            onPress={() => large.update((v) => !v)}
            class={`h-11 min-w-11 px-3 rounded-(--radius) items-center justify-center transition-colors duration-150 active:opacity-70 ${large() ? "bg-primary" : "bg-muted"}`}
          >
            <Text class={`font-bold ${large() ? "text-[18px] text-primary-foreground" : "text-[15px] text-foreground"}`}>Aa</Text>
          </View>
        </View>

        <Scroll
          ref={scroller}
          class="flex-1"
          scrollEventThrottle={32}
          onScroll={(e) => scrolled.set(e.offset.y > 96)}
        >
          <View class="w-full max-w-[680px] self-center px-5 pt-3 pb-12 gap-8" style={enter.style}>
            <View class="gap-3">
              <View class="flex-row items-center gap-2.5">
                <View class={`w-10 h-10 rounded-(--radius) items-center justify-center ${tone.tile}`}>
                  <Text class="text-xl">{m.icon}</Text>
                </View>
                <Text class={`text-xs font-bold uppercase tracking-wider ${tone.text}`}>{mname(m)}</Text>
                <View class={`px-2 py-0.5 rounded-(--radius-pill) ${t.mode === "now" ? "bg-destructive/15" : "bg-primary/15"}`}>
                  <Text class={`text-[11px] font-bold ${t.mode === "now" ? "text-destructive" : "text-primary"}`}>
                    {t.mode === "now" ? ti("detail.badge_now") : ti("detail.badge_later")}
                  </Text>
                </View>
              </View>
              <Text class="text-[26px] leading-[32px] font-bold tracking-tight text-foreground">{t.title}</Text>
              {t.intro ? <Text class={`text-foreground/85 ${bodyText()}`}>{t.intro}</Text> : null}
            </View>

            <If when={sections.length > 1}>
              <View class="flex-row flex-wrap gap-2 -mt-2">
                <Each of={sections}>
                  {(s) => (
                    <View
                      role="button"
                      accessibilityLabel={ti("section.go", { s: s().nav() })}
                      onPress={() => jump(s().id)}
                      class="flex-row items-center gap-1.5 h-9 px-3.5 rounded-(--radius-pill) bg-card border border-border transition duration-150 ease-out active:scale-[0.97] active:bg-accent"
                    >
                      <Text class="text-sm font-semibold text-foreground">{s().nav()}</Text>
                      <Text class="text-xs font-semibold text-muted-foreground">{String(s().count)}</Text>
                    </View>
                  )}
                </Each>
              </View>
            </If>

            <If when={sections.length === 0}>
              <View class="items-center gap-2 py-10 bg-card rounded-(--radius-card) border border-dashed border-input">
                <Text class="text-[16px] font-semibold text-foreground">{ti("empty.topic")}</Text>
                <Text class="text-[14px] text-muted-foreground">{ti("empty.topic_hint")}</Text>
              </View>
            </If>

            {t.choices?.length ? (
              <View class="gap-3" onLayout={track("choices")}>
                <SectionHead id="choices" title={ti("section.choices")} note={ti("section.choices_note")} />
                <Each of={t.choices}>{(c) => <ChoiceCard c={c()} />}</Each>
              </View>
            ) : null}

            {limits.length ? (
              <View class="gap-3" onLayout={track("limits")}>
                <SectionHead id="limits" title={ti("section.limits")} note={ti("section.limits_note")} danger />
                <View class="bg-destructive/10 border border-destructive/30 rounded-(--radius-card) px-4 py-3">
                  <Each of={limits.slice(0, LIMIT_PREVIEW)}>{(l) => <LimitRow text={l().text} />}</Each>
                  <If when={limits.length > LIMIT_PREVIEW}>
                    <Collapsible
                      open={allLimits()}
                      reveal
                      content={
                        <View>
                          <Each of={limits.slice(LIMIT_PREVIEW)}>{(l) => <LimitRow text={l().text} />}</Each>
                        </View>
                      }
                    />
                    <View
                      role="button"
                      accessibilityState={{ expanded: allLimits() }}
                      onPress={() => allLimits.update((v) => !v)}
                      class="self-start mt-2 mb-1 h-9 px-3.5 rounded-(--radius-pill) bg-card border border-destructive/30 justify-center transition duration-150 ease-out active:scale-[0.97] active:opacity-80"
                    >
                      <Text class="text-sm font-semibold text-destructive">
                        {allLimits() ? ti("limits.show_less") : ti("limits.show_all", { n: limits.length })}
                      </Text>
                    </View>
                  </If>
                </View>
              </View>
            ) : null}

            {t.prepare?.length ? (
              <View class="gap-3" onLayout={track("prepare")}>
                <SectionHead id="prepare" title={ti("section.prepare")} note={ti("section.prepare_note")} />
                <View class="bg-card rounded-(--radius-card) border border-border px-4">
                  <Each of={t.prepare}>{(r, i) => <ReadingRow item={r()} n={i() + 1} />}</Each>
                </View>
              </View>
            ) : null}

            {t.learn?.length ? (
              <View class="gap-3" onLayout={track("learn")}>
                <SectionHead id="learn" title={ti("section.learn")} note={ti("section.learn_note")} />
                <View class="bg-card rounded-(--radius-card) border border-border px-4">
                  <Each of={t.learn}>{(r) => <ReadingRow item={r()} />}</Each>
                </View>
              </View>
            ) : null}

            <View class="gap-3">
              <View
                role="button"
                onPress={() => openTopic(next.id)}
                class="flex-row items-center gap-3 bg-card rounded-(--radius-card) border border-border p-4 transition duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] active:bg-accent"
              >
                <View class={`w-10 h-10 rounded-(--radius) items-center justify-center ${TONE[meta(next.id).tone].tile}`}>
                  <Text class="text-xl">{meta(next.id).icon}</Text>
                </View>
                <View class="flex-1 gap-0.5">
                  <Text class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{ti("detail.next_topic")}</Text>
                  <Text class="text-[15px] leading-[20px] font-semibold text-foreground">{`${mname(meta(next.id))} — ${next.title}`}</Text>
                </View>
                <Text class="text-2xl text-muted-foreground/60">›</Text>
              </View>
              <View
                role="button"
                onPress={() => scrollTo(0)}
                class="self-center h-10 px-4 rounded-(--radius) justify-center transition-colors duration-150 active:bg-accent"
              >
                <Text class="text-sm font-semibold text-primary">{ti("detail.to_top")}</Text>
              </View>
            </View>
          </View>
        </Scroll>
      </View>
    );
  };

  // Tombol bahasa: label selalu nama bahasanya (tidak diterjemahkan).
  const LangButton = (props: { l: "id" | "en"; label: string }) => (
    <View
      role="button"
      accessibilityLabel={ti("lang.a11y")}
      onPress={() => {
        Haptics.selection();
        langPref.set(props.l);
        setLocale(props.l);
      }}
      class={`h-10 px-4 rounded-(--radius) items-center justify-center border transition duration-150 ease-out active:scale-[0.97] ${langPref() === props.l ? "bg-primary border-primary" : "bg-card border-border"}`}
    >
      <Text class={`text-sm font-semibold ${langPref() === props.l ? "text-primary-foreground" : "text-foreground"}`}>{props.label}</Text>
    </View>
  );

  // Peta offline: pilih wilayah, unduh, lalu geser/zoom. Vektor digambar di Canvas.
  const rname = (n: MapName) => (langPref() === "en" ? n.en : n.id);
  const kb = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

  const MapRow = (props: { r: MapRegion }) => {
    const have = () => onDevice()[props.r.id];
    const busy = () => mapBusy() === props.r.id;
    return (
      <View class="bg-card rounded-(--radius-card) border border-border p-3.5 gap-2.5">
        <View class="flex-row items-center gap-2">
          <Text class="flex-1 text-[16px] font-semibold text-foreground line-clamp-1">{rname(props.r.name)}</Text>
          <Text class="text-[12px] text-muted-foreground">{kb(have() ?? props.r.bytes)}</Text>
        </View>
        <View class="flex-row gap-2">
          <If
            when={have() == null}
            else={
              <View class="flex-row gap-2">
                <View
                  role="button"
                  onPress={() => showMap(props.r)}
                  class="flex-1 h-10 rounded-(--radius) bg-primary items-center justify-center transition duration-150 ease-out active:scale-[0.97]"
                >
                  <Text class="text-sm font-semibold text-primary-foreground">{ti("maps.open")}</Text>
                </View>
                <View
                  role="button"
                  onPress={() => dropMap(props.r)}
                  class="h-10 px-4 rounded-(--radius) bg-card border border-border items-center justify-center transition duration-150 ease-out active:scale-[0.97]"
                >
                  <Text class="text-sm font-semibold text-foreground">{ti("maps.remove")}</Text>
                </View>
              </View>
            }
          >
            <View
              role="button"
              onPress={() => saveMap(props.r)}
              disabled={busy()}
              class="flex-1 h-10 rounded-(--radius) bg-primary items-center justify-center transition duration-150 ease-out active:scale-[0.97] disabled:opacity-60"
            >
              <Text class="text-sm font-semibold text-primary-foreground">
                {busy() ? ti("maps.downloading") : ti("maps.download")}
              </Text>
            </View>
          </If>
        </View>
      </View>
    );
  };

  const Maps = () => {
    const used = () => Object.values(onDevice()).reduce((a, b) => a + b, 0);
    return (
      <View class="flex-1 bg-background">
        <View class="flex-row items-center gap-2 px-3 pb-2 bg-background border-b border-border pt-[calc(env(safe-area-inset-top)+8px)]">
          <View
            role="button"
            onPress={() => mapsOpen.set(false)}
            class="h-11 px-2 rounded-(--radius) justify-center transition-colors duration-150 active:bg-accent"
          >
            <Text class="text-[16px] font-semibold text-primary">{ti("reader.back")}</Text>
          </View>
          <Text class="flex-1 text-[15px] font-semibold text-foreground">{ti("maps.title")}</Text>
          <Text class="text-[12px] text-muted-foreground">{ti("maps.used", { n: kb(used()) })}</Text>
        </View>
        <Scroll class="flex-1">
          <View class="w-full max-w-[680px] self-center px-5 pt-4 pb-12 gap-3">
            <Text class="text-[13px] leading-[19px] text-muted-foreground">{ti("maps.note")}</Text>
            <If when={mapErr() !== ""}>
              <Text class="text-[13px] text-destructive">{mapErr()}</Text>
            </If>
            <If
              when={regions() == null}
              else={
                <View class="gap-2.5">
                  <Each of={regions() ?? []} key={(r: MapRegion) => r.id}>
                    {(r) => <MapRow r={r()} />}
                  </Each>
                </View>
              }
            >
              <If
                when={catErr() === ""}
                else={
                  <View class="bg-card rounded-(--radius-card) border border-border p-4 gap-2.5">
                    <Text class="text-[13px] text-destructive">{`${ti("maps.failed")} ${catErr()}`}</Text>
                    <View
                      role="button"
                      onPress={() => loadCatalogue()}
                      class="self-start h-10 px-4 rounded-(--radius) bg-primary items-center justify-center transition duration-150 ease-out active:scale-[0.97]"
                    >
                      <Text class="text-sm font-semibold text-primary-foreground">{ti("maps.retry")}</Text>
                    </View>
                  </View>
                }
              >
                <Text class="text-[13px] text-muted-foreground">{ti("maps.loading")}</Text>
              </If>
            </If>
          </View>
        </Scroll>
      </View>
    );
  };

  // Warna tetap: Canvas tidak membaca token tema.
  const MAP_INK = { coast: "#3f6b8a", border: "#9aa7b4", road: "#b07a34", river: "#6ba7c9", place: "#1f3a4a" };

  const MapViewer = () => {
    let start = { x: 0, y: 0 };
    const pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start = mapPan();
      },
      onPanResponderMove: (_: unknown, g: { dx: number; dy: number }) => mapPan.set({ x: start.x + g.dx, y: start.y + g.dy }),
    });
    const zoomBy = (f: number) => {
      Haptics.selection();
      mapZoom.set(Math.min(24, Math.max(1, mapZoom() * f)));
    };
    const draw = (cx: CanvasRenderingContext2D, size: { width: number; height: number }) => {
      const d = mapData();
      if (!d) return;
      const [w, s, e, n] = d.bbox;
      const mid = (((s + n) / 2) * Math.PI) / 180;
      const k = Math.min(size.width / ((e - w) * Math.cos(mid)), size.height / (n - s)) * mapZoom();
      const ox = size.width / 2 + mapPan().x;
      const oy = size.height / 2 + mapPan().y;
      const X = (lon: number) => ox + (lon - (w + e) / 2) * Math.cos(mid) * k;
      const Y = (lat: number) => oy - (lat - (s + n) / 2) * k;
      cx.fillStyle = "#e9eff4";
      cx.fillRect(0, 0, size.width, size.height);
      for (const kind of ["river", "road", "border", "coast"] as const) {
        cx.strokeStyle = MAP_INK[kind];
        cx.lineWidth = kind === "coast" ? 1.3 : 0.9;
        cx.setLineDash(kind === "border" ? [4, 3] : []);
        cx.beginPath();
        for (const line of d.lines) {
          if (line.k !== kind || line.p.length < 4) continue;
          cx.moveTo(X(line.p[0]), Y(line.p[1]));
          for (let i = 2; i < line.p.length; i += 2) cx.lineTo(X(line.p[i]), Y(line.p[i + 1]));
        }
        cx.stroke();
      }
      cx.setLineDash([]);
      cx.fillStyle = MAP_INK.place;
      cx.font = "600 10px system-ui";
      for (const pl of d.places) {
        if (pl.r > 3 && mapZoom() < 3) continue;
        const x = X(pl.p[0]);
        const y = Y(pl.p[1]);
        if (x < -40 || y < 0 || x > size.width + 40 || y > size.height) continue;
        cx.beginPath();
        cx.arc(x, y, pl.r === 1 ? 3 : 2, 0, Math.PI * 2);
        cx.fill();
        cx.fillText(pl.n, x + 4, y + 3);
      }
    };
    return (
      <View class="flex-1 bg-background">
        <View class="flex-row items-center gap-2 px-3 pb-2 bg-background border-b border-border pt-[calc(env(safe-area-inset-top)+8px)]">
          <View
            role="button"
            onPress={() => {
              openMap.set(null);
              mapData.set(null);
            }}
            class="h-11 px-2 rounded-(--radius) justify-center transition-colors duration-150 active:bg-accent"
          >
            <Text class="text-[16px] font-semibold text-primary">{ti("reader.back")}</Text>
          </View>
          <View class="flex-1">
            <Text class="text-[15px] font-semibold text-foreground line-clamp-1">
              {openMap() ? rname(openMap()!.name) : ""}
            </Text>
          </View>
          <View role="button" onPress={() => zoomBy(1 / 1.6)} class="w-10 h-10 rounded-(--radius) bg-card border border-border items-center justify-center active:scale-[0.97]">
            <Text class="text-[18px] font-bold text-foreground">−</Text>
          </View>
          <View role="button" onPress={() => zoomBy(1.6)} class="w-10 h-10 rounded-(--radius) bg-card border border-border items-center justify-center active:scale-[0.97]">
            <Text class="text-[18px] font-bold text-foreground">+</Text>
          </View>
        </View>
        <View class="flex-1" {...pan.panHandlers}>
          <If
            when={mapData() != null}
            else={
              <View class="flex-1 items-center justify-center px-6">
                <Text class={`text-[13px] text-center ${mapErr() ? "text-destructive" : "text-muted-foreground"}`}>
                  {mapErr() || ti("maps.loading")}
                </Text>
                <If when={mapErr() !== ""}>
                  <View
                    role="button"
                    onPress={() => openMap() && showMap(openMap()!)}
                    class="mt-3 h-10 px-4 rounded-(--radius) bg-primary items-center justify-center active:scale-[0.97]"
                  >
                    <Text class="text-sm font-semibold text-primary-foreground">{ti("maps.retry")}</Text>
                  </View>
                </If>
              </View>
            }
          >
            <Canvas style={{ height: windowSize().height - 210 }} draw={draw} />
          </If>
        </View>
        <View class="px-4 py-3 border-t border-border bg-background pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <Text class="text-[12px] text-muted-foreground">{ti("maps.credit")}</Text>
        </View>
      </View>
    );
  };

  // Pembaca PDF: satu halaman FEMA 477, navigasi sebelumnya/berikutnya.
  const Reader = () => {
    const book = (): Book => bookOf(reader()?.doc ?? "")!;
    const page = () => reader()?.page ?? 1;
    const idx = () => book().pages.findIndex((p) => p.n === page());
    const pg = book().pages[Math.max(0, idx())];
    const w = Math.min(680, windowSize().width - 32);
    const h = Math.round((w * pg.h) / pg.w);
    const enter = createMotion({ enter: { duration: 220, easing: EASE_OUT, keyframes: { opacity: [0, 1], translateY: [12, 0] } } });
    const go = (d: number) => {
      Haptics.selection();
      const next = book().pages[idx() + d];
      if (next) reader.update((r) => (r ? { doc: r.doc, page: next.n } : r));
    };
    return (
      <View class="flex-1 bg-background">
        <View class="flex-row items-center gap-2 px-3 pb-2 bg-background border-b border-border pt-[calc(env(safe-area-inset-top)+8px)]">
          <View
            role="button"
            onPress={() => reader.set(null)}
            class="h-11 px-2 rounded-(--radius) justify-center transition-colors duration-150 active:bg-accent"
          >
            <Text class="text-[16px] font-semibold text-primary">{ti("reader.back")}</Text>
          </View>
          <View class="flex-1 items-center">
            <Text class="text-[15px] font-semibold text-foreground line-clamp-1">{book().title}</Text>
          </View>
          <Text class="text-[15px] font-bold text-foreground">{ti("read.page", { n: page() })}</Text>
        </View>
        <Scroll class="flex-1 bg-muted/40">
          <View class="items-center px-4 pt-4 pb-10 gap-3" style={enter.style}>
            <Image
              src={pg.src}
              style={{ width: w, height: h }}
              class="rounded-(--radius-card) border border-border bg-card"
            />
            <Text class="text-[12px] text-muted-foreground">{langPref() === "en" ? book().credit.en : book().credit.id}</Text>
          </View>
        </Scroll>
        <View class="flex-row items-center gap-3 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] border-t border-border bg-background">
          <View
            role="button"
            onPress={() => go(-1)}
            disabled={idx() <= 0}
            class="flex-1 h-11 rounded-(--radius) bg-card border border-border items-center justify-center transition duration-150 ease-out active:scale-[0.97] disabled:opacity-40"
          >
            <Text class="text-sm font-semibold text-foreground">{ti("reader.prev")}</Text>
          </View>
          <View
            role="button"
            onPress={() => go(1)}
            disabled={idx() >= book().pages.length - 1}
            class="flex-1 h-11 rounded-(--radius) bg-primary items-center justify-center transition duration-150 ease-out active:scale-[0.97] disabled:opacity-40"
          >
            <Text class="text-sm font-semibold text-primary-foreground">{ti("reader.next")}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Branch reaktif: signal dibaca DI DALAM ekspresi JSX, bukan di badan komponen.
  return (
    <View class="flex-1 bg-background">
      {openMap() != null ? (
        <MapViewer />
      ) : mapsOpen() ? (
        <Maps />
      ) : reader() != null ? (
        <Reader />
      ) : topic() ? (
        <Detail t={topic()!} />
      ) : (
        <Home />
      )}
    </View>
  );
}

mount(App);
