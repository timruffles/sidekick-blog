require "jekyll-asset-pipeline"
require 'coffee-script'
require 'sass'

module JekyllAssetPipeline
  class CoffeeScriptConverter < JekyllAssetPipeline::Converter

    def self.filetype
      '.coffee'
    end

    def convert
      return CoffeeScript.compile(@content)
    end
  end

  class SassScriptConverter < JekyllAssetPipeline::Converter

    def self.filetype
      '.sass'
    end

    def convert
      return Sass.compile(@content)
    end
  end
end
