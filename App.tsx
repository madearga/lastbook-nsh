import { mount, signal, Scroll, Text, View } from "nsh";
import { TOPICS, type ReadItem, type Topic } from "./topics";

// Lastbook mobile — layar pertama: daftar topik & detail bacaan.
// Data: content/topics/*.json asli dari Immortal-Protocols/lastbook (MIT).

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
    <View style={{ paddingVertical: 8, gap: 2 }}>
      <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1f2328" }}>{props.item.label}</Text>
      {props.item.note ? <Text style={{ fontSize: 12, color: "#57606a" }}>{props.item.note}</Text> : null}
      {props.item.page ? <Text style={{ fontSize: 11, color: "#8c959f" }}>📄 hal. {props.item.page}</Text> : null}
    </View>
  );
}

function Card(props: { title: string; hint: string; onPress: () => void; accent: string }) {
  return (
    <View
      onPress={props.onPress}
      style={{
        backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 2,
        borderLeftWidth: 4, borderLeftColor: props.accent,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1f2328" }}>{props.title}</Text>
      <Text style={{ fontSize: 12, color: "#57606a" }}>{props.hint}</Text>
    </View>
  );
}

function App() {
  const selected = signal<string | null>(null);
  const expanded = signal<string | null>(null);

  const topic = (): Topic | undefined => TOPICS.find((t) => t.id === selected());

  const Home = () => (
    <Scroll style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <View style={{ padding: 20, paddingTop: 56, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#1f2328" }}>📖 Lastbook</Text>
          <Text style={{ fontSize: 13, color: "#57606a" }}>
            Everything you need to survive and rebuild society. Offline, private.
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          <Each of={TOPICS}>
            {(t) => (
              <Card
                title={`${ICON[t().id] ?? "📖"}  ${t().title}`}
                hint={t().short ?? ""}
                accent={ACCENT[t().id] ?? "#6e7781"}
                onPress={() => { expanded.set(null); selected.set(t().id); }}
              />
            )}
          </Each>
        </View>
        <Text style={{ fontSize: 11, color: "#8c959f" }}>
          Data topik asli dari lastbook (MIT). Pembacaan PDF & peta menyusul.
        </Text>
      </View>
    </Scroll>
  );

  const Detail = (props: { t: Topic }) => (
    <Scroll style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <View style={{ padding: 20, paddingTop: 48, gap: 14 }}>
        <View onPress={() => { expanded.set(null); selected.set(null); }}>
          <Text style={{ fontSize: 15, color: "#0969da" }}>‹ Semua topik</Text>
        </View>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1f2328" }}>
            {ICON[props.t.id] ?? "📖"}  {props.t.title}
          </Text>
          {props.t.intro ? <Text style={{ fontSize: 14, color: "#57606a" }}>{props.t.intro}</Text> : null}
        </View>

        {props.t.choices ? (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1f2328" }}>What's happening?</Text>
            <Each of={props.t.choices}>
              {(c) => (
                <View style={{ gap: 8 }}>
                  <Card
                    title={c().label}
                    hint={c().hint ?? ""}
                    accent={ACCENT[props.t.id] ?? "#6e7781"}
                    onPress={() => expanded.set(expanded() === c().id ? null : c().id)}
                  />
                  {expanded() === c().id ? (
                    <View style={{ backgroundColor: "#ffffff", borderRadius: 12, padding: 12 }}>
                      <Each of={c().read}>{(r) => <ReadingRow item={r()} />}</Each>
                    </View>
                  ) : null}
                </View>
              )}
            </Each>
          </View>
        ) : null}

        {props.t.limits?.length ? (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#cf222e" }}>Limits</Text>
            <Each of={props.t.limits}>{(l) => (
              <Text style={{ fontSize: 13, color: "#57606a" }}>• {l().text}</Text>
            )}</Each>
          </View>
        ) : null}

        {props.t.prepare?.length ? (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1f2328" }}>Prepare</Text>
            <Each of={props.t.prepare}>{(r) => <ReadingRow item={r()} />}</Each>
          </View>
        ) : null}

        {props.t.learn?.length ? (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1f2328" }}>Learn</Text>
            <Each of={props.t.learn}>{(r) => <ReadingRow item={r()} />}</Each>
          </View>
        ) : null}
      </View>
    </Scroll>
  );

  const t = topic();
  return t ? <Detail t={t} /> : <Home />;
}

mount(App);
