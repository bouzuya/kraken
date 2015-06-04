module.exports = class AtomFormatter
  constructor: (@atom) ->

  format: ->
    atom = @atom
    """
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>#{@_escapeHtml(atom.title)}</title>
        <link rel="alternate" type="text/html" href="#{atom.linkHref}" />
        <updated>#{atom.updated}</updated>
        <id>#{atom.id}</id>
        <author>
          <name>#{atom.author.name}</name>
        </author>
        #{atom.entries.map(@_buildEntry.bind(@)).join('\n')}
      </feed>
    """

  _buildEntry: (entry) ->
    """
      <entry>
        <title>#{@_escapeHtml(entry.title)}</title>
        <link href="#{entry.linkHref}" />
        <updated>#{entry.updated}</updated>
        <id>#{entry.id}</id>
        <content type="html">#{@_escapeHtml(entry.content)}</content>
      </entry>
    """

  _escapeHtml: (html) ->
    html
    .replace /&/g, '&amp;'
    .replace /</g, '&lt;'
    .replace />/g, '&gt;'
    .replace /"/g, '&quot;'
    .replace /'/g, '&apos;'
