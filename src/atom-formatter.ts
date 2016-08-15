import { Atom, AtomEntry } from './atom-builder';

export class AtomFormatter {
  constructor(private atom: Atom) {
    this.atom = atom;
  }

  format(): string {
    var atom: Atom;
    atom = this.atom;
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<feed xmlns=\"http://www.w3.org/2005/Atom\">\n  <title>" + (this._escapeHtml(atom.title)) + "</title>\n  <link rel=\"alternate\" type=\"text/html\" href=\"" + atom.linkHref + "\" />\n  <updated>" + atom.updated + "</updated>\n  <id>" + atom.id + "</id>\n  <author>\n    <name>" + atom.author.name + "</name>\n  </author>\n  " + (atom.entries.map(this._buildEntry.bind(this)).join('\n')) + "\n</feed>";
  };

  _buildEntry(entry: AtomEntry): string {
    return "<entry>\n  <title>" + (this._escapeHtml(entry.title)) + "</title>\n  <link href=\"" + entry.linkHref + "\" />\n  <updated>" + entry.updated + "</updated>\n  <id>" + entry.id + "</id>\n  <content type=\"html\">" + (this._escapeHtml(entry.content)) + "</content>\n</entry>";
  };

  _escapeHtml(html: string): string {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  };
}
