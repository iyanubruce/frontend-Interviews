interface JQuery {
  toggleClass: (className: string, state?: boolean) => JQuery;
  addClass: (className: string) => JQuery;
  removeClass: (className: string) => JQuery;
}

export default function $(selector: string): JQuery {
  const element = document.querySelector(selector);

  return {
    toggleClass: function (className: string, state?: boolean): JQuery {
      throw new Error("Not implemented!");
    },
    addClass: function (className: string): JQuery {
      throw new Error("Not implemented!");
    },
    removeClass: function (className): JQuery {
      throw new Error("Not implemented!");
    },
  };
}
