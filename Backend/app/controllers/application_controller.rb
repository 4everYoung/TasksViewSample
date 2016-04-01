class ApplicationController < ActionController::Base
  protect_from_forgery
  after_filter :set_csrf_cookie_for_ng

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

  def hash_string_symbols hash
    hash.inject({}){|m,(k,v)| m[k.to_sym] = v; m}
  end

  private

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end
end
