export type DelegatedEventListener = (
  event: Event,
  matchedElement: Element,
) => void;

export default function delegateEvent(
  container: Element,
  eventName: string,
  selector: string,
  listener: DelegatedEventListener,
): () => void {
  throw new Error("Not implemented!");
}
