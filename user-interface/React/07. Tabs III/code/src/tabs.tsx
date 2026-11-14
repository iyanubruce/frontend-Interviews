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

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
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
