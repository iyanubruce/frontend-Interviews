import { useId, useState } from 'react';

type TabItem = Readonly<{
  value: string;
  label: React.ReactNode;
  panel: React.ReactNode;
}>;

function getTabListItemId(tabsId: string, value: string) {
  return tabsId + '-tab-' + value;
}

function getTabPanelId(tabsId: string, value: string) {
  return tabsId + '-tabpanel-' + value;
}

export default function Tabs({
  defaultValue,
  items,
}: Readonly<{ defaultValue?: string; items: ReadonlyArray<TabItem> }>) {
  const tabsId = useId();
  const [value, setValue] = useState(defaultValue ?? items[0].value);

  function setValueViaIndex(index: number) {
    const newValue = items[index].value;
    setValue(newValue);
    document.getElementById(getTabListItemId(tabsId, newValue))!.focus();
  }

  return (
    <div className="tabs">
      <div
        className="tabs-list"
        role="tablist"
        onKeyDown={(event) => {
          switch (event.code) {
            case 'ArrowLeft': {
              event.preventDefault();
              const index = items.findIndex(
                ({ value: itemValue }) => itemValue === value,
              );
              setValueViaIndex(
                // Use modulo to wrap around to the end if necessary.
                (index - 1 + items.length) % items.length,
              );
              break;
            }
            case 'ArrowRight': {
              event.preventDefault();
              const index = items.findIndex(
                ({ value: itemValue }) => itemValue === value,
              );
              // Use modulo to wrap around to the start if necessary.
              setValueViaIndex((index + 1) % items.length);
              break;
            }
            case 'Home': {
              event.preventDefault();
              // Set the first item as the active item.
              setValueViaIndex(0);
              break;
            }
            case 'End': {
              event.preventDefault();
              // Set the last item ias the active item.
              setValueViaIndex(items.length - 1);
              break;
            }
            default:
              break;
          }
        }}>
        {items.map(({ label, value: itemValue }) => {
          const isActiveValue = itemValue === value;

          return (
            <button
              id={getTabListItemId(tabsId, itemValue)}
              key={itemValue}
              type="button"
              className={[
                'tabs-list-item',
                isActiveValue && 'tabs-list-item--active',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setValue(itemValue);
              }}
              role="tab"
              tabIndex={isActiveValue ? 0 : -1}
              aria-controls={getTabPanelId(tabsId, itemValue)}
              aria-selected={isActiveValue}>
              {label}
            </button>
          );
        })}
      </div>
      <div>
        {items.map(({ panel, value: itemValue }) => (
          <div
            key={itemValue}
            tabIndex={0}
            id={getTabPanelId(tabsId, itemValue)}
            aria-labelledby={getTabListItemId(tabsId, itemValue)}
            role="tabpanel"
            hidden={itemValue !== value}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
