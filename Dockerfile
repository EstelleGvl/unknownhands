FROM ruby:2.7.8-bullseye

LABEL maintainer="Estelle <you@example.com>"

# ▶ Force Ruby platform so Bundler compiles native gems (avoids musl prebuilds)
ENV BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_FORCE_RUBY_PLATFORM=1

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
      build-essential \
      git \
      curl \
      ca-certificates \
      nodejs \
      npm \
      pkg-config \
      libffi-dev \        # ▶ needed to compile the ffi gem
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Gemfile Gemfile.lock *.gemspec ./

# Match the lockfile’s Bundler version
RUN gem install bundler:1.17.2

# ▶ Use the pinned bundler
RUN bundle _1.17.2_ install --jobs 4 --retry 3

# Copy the rest
COPY . .