require "ostruct"
require "yaml"

class HintOptions
  def self.fetch
    options = YAML.load_file(File.dirname(__FILE__) + "/../hint.yaml")
    to_sealed options["options"]
  end
  def self.to_sealed val
    case val
    when Hash
      converted = val.inject({}) do |rep,(k,v)|
        rep[k] = to_sealed(v)
        rep
      end
      ImmutableStructFromHash.new converted
    when Array
      val.map {|v| to_sealed(v) }
    else
      val
    end
  end
end

class ImmutableStructFromHash < OpenStruct
  def initialize *args, &block
    super
    @sealed = true
  end
  def sealed?
    @sealed != nil
  end
  def each *args, &block
    @table.each *args, &block
  end
  def method_missing k, *args
    return super unless sealed?
    if /=\Z/ =~ k.to_s
      raise "Can't change after sealed"
    elsif respond_to?(k)
      return self.send(k,*args)
    elsif args.length == 0 && k != :[]
      @table.fetch(k.to_s)
    else
      raise NoMethodError.new("No key or method #{k} for Settings")
    end
  end
end
