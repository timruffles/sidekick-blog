

task :deploy do
  diffs = `git diff --name-status HEAD`
  unless diffs.split("\n").empty?
    puts "Can't deploy, unsaved changes:"
    puts diffs
  end
  %x(
  set -e
  git checkout gh-pages
  git reset --hard master
  BASE_URL=/sidekick-blog nanoc compile
  ls | grep -v output | while read file; do rm -rf $file; done 
  mv output/* .
  rm -rf output
  git add . -A
  git commit -m 'latest'
  git push --force public gh-pages
  )
end
