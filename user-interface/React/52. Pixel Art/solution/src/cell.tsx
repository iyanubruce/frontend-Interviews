import { COLORS, Color } from './colors';

type Props = Readonly<{
  color: Color | null;
  column: number;
  isDragging: boolean;
  onDragStart: () => void;
  onMark: () => void;
  row: number;
}>;

export default function Cell({
  color,
  column,
  isDragging,
  onDragStart,
  onMark,
  row,
}: Props) {
  return (
    <button
      aria-label={`Pixel row ${row}, column ${column}, ${color ?? 'empty'}`}
      aria-pressed={color != null}
      onClick={onMark}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return;
        }

        onDragStart();
        onMark();
      }}
      onPointerEnter={isDragging ? onMark : undefined}
      style={{
        backgroundColor: color != null ? COLORS[color] : undefined,
      }}
      type="button"
      className="grid__cell"
    />
  );
}
