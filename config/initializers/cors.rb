Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'],
      credentials: true  # ← ✅ THIS LINE allows cookies + Authorization headers

    resource '/cable',
      headers: :any,
      methods: [:get, :post, :options],
      expose: ['Authorization'],
      credentials: true  # ← ✅ SAME HERE
  end
end
