import { StyleSheet, View } from 'react-native';

import { colors, radius, size, tones, type Tone } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type GaugeProps = {
  label: string;
  /** Value line under the label, e.g. "4,210 / 7,000". */
  detail?: string;
  /** 0–100. */
  percent: number;
  tone: Tone;
  icon?: IconName;
  /** Optional dotted marker (e.g. day-0 value), 0–100. */
  baseline?: number;
  /** Show the right-hand value as "60%" (default) or as a black check once done. */
  done?: boolean;
  /** Custom right-hand value instead of the percentage. */
  value?: string;
  height?: number;
};

/** White card whose background fills with the tone up to `percent`, with a 2px cocoa edge. */
export function Gauge({ label, detail, percent, tone, icon, baseline, done, value, height = size.gauge }: GaugeProps) {
  const pct = Math.max(0, Math.min(100, percent));
  const showEdge = pct > 0 && pct < 100;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.card, { height }]}
    >
      <View
        style={[
          styles.fill,
          { width: `${pct}%`, backgroundColor: tones[tone].bg },
          showEdge && { borderRightWidth: 2, borderRightColor: colors.cocoa },
        ]}
      />
      {baseline != null ? <View style={[styles.baseline, { left: `${baseline}%` }]} /> : null}
      <View style={styles.row}>
        {icon ? <Icon name={icon} size={20} strokeWidth={1.6} /> : null}
        <View style={styles.text}>
          <Txt variant="bodyStrong" numberOfLines={1}>
            {label}
          </Txt>
          {detail ? (
            <Txt variant="small" color={colors.greySoft} numberOfLines={1}>
              {detail}
            </Txt>
          ) : null}
        </View>
        {done ? (
          <View style={styles.check} accessibilityLabel="Done">
            <Icon name="check" size={12} strokeWidth={2.8} color={colors.white} />
          </View>
        ) : (
          <Txt variant="bodyStrong" weight={700} style={{ letterSpacing: -0.3 }}>
            {value ?? `${Math.round(pct)}%`}
          </Txt>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.gauge,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  baseline: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    width: 0,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.cocoa,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 },
  text: { flex: 1, gap: 2, minWidth: 0 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
