import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, size, tones, type Tone } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type IconTileProps = { icon: IconName; tone: Tone; large?: boolean };

/** 34px (or 38px) tone square holding a line icon. */
export function IconTile({ icon, tone, large }: IconTileProps) {
  const s = large ? size.iconTileLg : size.iconTile;
  return (
    <View
      style={{
        width: s,
        height: s,
        borderRadius: large ? 12 : radius.iconTile,
        backgroundColor: tones[tone].bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={16} strokeWidth={1.8} color={tones[tone].soft} />
    </View>
  );
}

/** Uppercase grey label above a grouped list. */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Txt variant="eyebrow" color={colors.grey} style={{ marginTop: 10 }}>
      {children}
    </Txt>
  );
}

/** Mist card grouping rows, separated by hairlines. */
export function ListGroup({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {row}
          {i < rows.length - 1 ? <View style={styles.divider} /> : null}
        </Fragment>
      ))}
    </View>
  );
}

type ListRowProps = {
  icon: IconName;
  tone: Tone;
  label: string;
  /** Second line under the label. */
  detail?: string;
  /** Icon tile background; `white` for neutral rows (reminders, account). */
  tileOnWhite?: boolean;
  /** Right side: short grey value, or any control (Switch, SegmentedControl). */
  value?: string;
  right?: ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  /** Extra content under the row, indented to the label (pills, day circles). */
  children?: ReactNode;
};

export function ListRow({ icon, tone, label, detail, tileOnWhite, value, right, chevron, onPress, children }: ListRowProps) {
  return (
    <Pressable disabled={!onPress} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined} style={styles.row}>
      <View style={styles.line}>
        {tileOnWhite ? (
          <View style={styles.whiteTile}>
            <Icon name={icon} size={16} strokeWidth={1.8} />
          </View>
        ) : (
          <IconTile icon={icon} tone={tone} />
        )}
        <View style={{ flex: 1, gap: 1 }}>
          <Txt variant="body">{label}</Txt>
          {detail ? (
            <Txt variant="small" color={colors.grey}>
              {detail}
            </Txt>
          ) : null}
        </View>
        {value ? (
          <Txt variant="meta" color={colors.grey}>
            {value}
          </Txt>
        ) : null}
        {right}
        {chevron ? <Icon name="chevronRight" size={14} strokeWidth={2} color={colors.grey} /> : null}
      </View>
      {children ? <View style={styles.extra}>{children}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: radius.card, backgroundColor: colors.mist, paddingHorizontal: 16, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: colors.lineOnMist },
  row: { paddingVertical: 12, gap: 10 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  extra: { paddingLeft: 46 },
  whiteTile: {
    width: size.iconTile,
    height: size.iconTile,
    borderRadius: radius.iconTile,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
