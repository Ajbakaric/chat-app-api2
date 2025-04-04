Warden::Manager.after_authentication do |user, auth, opts|
    Rails.logger.debug "[🐞DEBUG] Warden successfully authenticated user: #{user.inspect}"
  end
  
  Warden::Manager.before_failure do |env, opts|
    Rails.logger.debug "[🪲DEBUG] Warden failed to authenticate. Options: #{opts.inspect}"
  
    # Bonus: print request params for extra visibility
    request = Rack::Request.new(env)
    Rails.logger.debug "[🕷️DEBUG] Params on failure: #{request.params.inspect}"
  end
  