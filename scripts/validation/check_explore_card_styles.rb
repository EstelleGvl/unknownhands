#!/usr/bin/env ruby

module_dir = File.expand_path('../../assets/js/explore/modules', __dir__)
accepted_classes = %w[
  explore-card
  explore-insight-card
  explore-metric-card
  explore-summary-card
]

violations = []

Dir.glob(File.join(module_dir, '*.js')).sort.each do |path|
  File.foreach(path).with_index(1) do |line, line_number|
    next unless line.include?('background: linear-gradient(135deg')
    next unless line.include?('color: white')
    next unless line.match?(/padding: 1\.(?:25|5)rem/)
    next if accepted_classes.any? { |class_name| line.include?(class_name) }

    violations << "#{path}:#{line_number}: unclassified Explore card"
  end
end

if violations.empty?
  puts 'Explore card style check passed.'
  exit 0
end

warn violations.join("\n")
warn 'Use a shared Explore card class instead of introducing another standalone card style.'
exit 1
