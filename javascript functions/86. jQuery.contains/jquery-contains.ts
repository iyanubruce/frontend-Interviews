interface JQueryStatic {
  contains: (container: Element, contained: Node | null) => boolean;
}

const jQuery: JQueryStatic = {
  contains(container: Element, contained: Node | null): boolean {
    throw new Error("Not implemented!");
  },
};

export default jQuery;
