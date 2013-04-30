include Nanoc::Helpers::Rendering
include Nanoc::Helpers::Blogging

def slug string
  string.strip.downcase.gsub(/[^\w_\- ]/,"").squeeze(" ").gsub(" ","-").squeeze("-")
end

require "nokogiri"
def first_paragraph html
  doc = Nokogiri::HTML(html)
  candidates = doc.css(".intro") + doc.css("p")
  return "" if candidates.empty?
  "<p>#{candidates.first.content}</p>"
end
def replace_tags html,a,b
  doc = Nokogiri::HTML(html)
  doc.css(a).each {|tag| tag.name = b }
  doc.to_html
end
