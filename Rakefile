require 'yaml'

@config  = YAML.load_file '_config.yml'
@baseurl = ENV['BASEURL'] || @config.dig('baseurl')

namespace :site do
  desc 'build the Jekyll site'
  task :build do
    sh "bundle exec jekyll build"
  end

  desc 'check Explore modules for unclassified legacy card styles'
  task :check_explore_cards do
    ruby 'scripts/validation/check_explore_card_styles.rb'
  end
end

namespace :data do
  python = ENV['PYTHON'] || '/opt/anaconda3/bin/python'

  desc 'refresh ALTO-derived IIIF annotations and transcription search indexes'
  task :refresh_transcriptions do
    sh "python3 scripts/setup_manuscripts.py data/manuscripts.csv"
    sh "#{python} scripts/pagexml_to_iiif.py --all"
    sh "#{python} scripts/build_transcription_corpus.py"
    sh "#{python} scripts/split_search_corpus.py"
  end

  desc 'refresh ALTO-derived scribal fingerprint profiles'
  task :refresh_fingerprints do
    sh "#{python} scripts/paleography_pipeline/map_scribes_to_manuscripts_v2.py"
    sh "#{python} scripts/paleography_pipeline/generate_scribe_profiles_v4.py"
  end

  desc 'refresh viewer annotations, transcription search, scribal fingerprints, and build the site'
  task refresh_all: [:refresh_transcriptions, :refresh_fingerprints] do
    sh "BUNDLE_IGNORE_CONFIG=1 bundle exec jekyll build"
  end
end
