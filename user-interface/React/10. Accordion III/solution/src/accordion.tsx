import { useId, useState } from 'react';

type AccordionSection = Readonly<{
  value: string;
  title: React.ReactNode;
  contents: React.ReactNode;
}>;

function getAccordionHeaderId(accordionId: string, value: string) {
  return accordionId + '-header-' + value;
}

function getAccordionPanelId(accordionId: string, value: string) {
  return accordionId + '-panel-' + value;
}

export default function Accordion({
  sections,
}: Readonly<{ sections: ReadonlyArray<AccordionSection> }>) {
  const accordionId = useId();
  const [openSections, setOpenSections] = useState(new Set<string>());

  function focusOnSection(index: number) {
    document
      .getElementById(getAccordionHeaderId(accordionId, sections[index].value))!
      .focus();
  }

  return (
    <div
      className="accordion"
      onKeyDown={(event) => {
        if (
          !(event.target instanceof HTMLElement) ||
          !event.target.id.startsWith(`${accordionId}-header-`)
        ) {
          return;
        }

        const activeItemValue = event.target.getAttribute(
          'data-accordion-value',
        );

        switch (event.code) {
          case 'ArrowUp': {
            event.preventDefault();
            const index = sections.findIndex(
              ({ value: itemValue }) => itemValue === activeItemValue,
            );
            focusOnSection((index - 1 + sections.length) % sections.length);
            break;
          }
          case 'ArrowDown': {
            event.preventDefault();
            const index = sections.findIndex(
              ({ value: itemValue }) => itemValue === activeItemValue,
            );
            focusOnSection((index + 1) % sections.length);
            break;
          }
          case 'Home': {
            event.preventDefault();
            focusOnSection(0);
            break;
          }
          case 'End': {
            event.preventDefault();
            focusOnSection(sections.length - 1);
            break;
          }
          default:
            break;
        }
      }}>
      {sections.map(({ value, title, contents }) => {
        const isExpanded = openSections.has(value);
        const headerId = getAccordionHeaderId(accordionId, value);
        const panelId = getAccordionPanelId(accordionId, value);

        return (
          <div className="accordion-item" key={value}>
            <button
              aria-controls={panelId}
              aria-expanded={isExpanded}
              id={headerId}
              className="accordion-item-title"
              type="button"
              data-accordion-value={value}
              onClick={() => {
                const newOpenSections = new Set(openSections);
                newOpenSections.has(value)
                  ? newOpenSections.delete(value)
                  : newOpenSections.add(value);
                setOpenSections(newOpenSections);
              }}>
              {title}{' '}
              <span
                aria-hidden={true}
                className={[
                  'accordion-icon',
                  isExpanded && 'accordion-icon--rotated',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </button>
            <div
              aria-labelledby={headerId}
              role="region"
              className="accordion-item-contents"
              id={panelId}
              hidden={!isExpanded}>
              {contents}
            </div>
          </div>
        );
      })}
    </div>
  );
}
