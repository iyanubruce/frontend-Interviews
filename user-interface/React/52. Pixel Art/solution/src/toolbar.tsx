import { COLORS, Color, Mode } from './colors';

type Props = Readonly<{
  selectedColor: Color;
  onColorChange: (color: Color) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}>;

export default function Toolbar({
  selectedColor,
  onColorChange,
  mode,
  onModeChange,
}: Props) {
  function onColorClick(color: Color) {
    onModeChange('draw');
    onColorChange(color);
  }

  return (
    <div className="toolbar">
      <div>
        <button
          aria-pressed={mode === 'draw'}
          onClick={() => onModeChange('draw')}
          className={[
            'toolbar__mode',
            mode === 'draw' && 'toolbar__mode--selected',
          ]
            .filter(Boolean)
            .join(' ')}>
          Draw
        </button>
        <button
          aria-pressed={mode === 'erase'}
          onClick={() => onModeChange('erase')}
          className={[
            'toolbar__mode',
            mode === 'erase' && 'toolbar__mode--selected',
          ]
            .filter(Boolean)
            .join(' ')}>
          Erase
        </button>
      </div>
      <div className="toolbar__color-picker">
        {Object.entries(COLORS).map(([color, hex]) => (
          <button
            key={color}
            aria-label={color}
            aria-pressed={color === selectedColor}
            className={[
              'toolbar__color',
              color === selectedColor && 'toolbar__color--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              borderColor: (() => {
                if (color !== selectedColor && color === 'white') {
                  return '#ccc';
                }

                if (color === selectedColor && color === 'black') {
                  return '#fff';
                }
              })(),
              backgroundColor: hex as string,
            }}
            onClick={() => onColorClick(color as Color)}
          />
        ))}
      </div>
    </div>
  );
}
