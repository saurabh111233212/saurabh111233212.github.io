dev:
	@lsof -t -i:4000 | xargs kill -9 2>/dev/null || true
	bundle exec jekyll serve