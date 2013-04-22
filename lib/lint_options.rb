require "yaml"

class LintOptions
  def self.fetch
    YAML.load_file(File.dirname(__FILE__) + "/../hint.yaml")
  end
end

