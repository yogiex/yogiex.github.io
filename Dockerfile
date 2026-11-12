FROM ruby:3.2

WORKDIR /srv/jekyll

# Pasang dependensi lebih dulu supaya layer cache tidak rusak setiap ada
# perubahan konten.
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.4.22 --no-document \
    && bundle install --jobs 4 --retry 3

COPY . .

EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000"]
