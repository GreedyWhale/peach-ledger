class FormatResponse
  def generate (data, message = :'请求成功', status = 200, errors)
    { data: data, message: message, status: status, errors: errors }
  end
end
