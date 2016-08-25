declare module 'commander-b' {
  var commander: any;
  export = commander;
}

declare module 'kuromoji' {
  var kuromoji: any;
  export = kuromoji;
}

declare module 'marked' {
  function marked(markdownString: string): string;
  namespace marked { }
  export = marked;
}
