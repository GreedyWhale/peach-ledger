require 'acceptance_helper'

resource "Users" do
  # 接口描述
  explanation "获取用户信息"

  # 添加token到请求头
  authentication :basic, :auth
  let(:user) { User.create_or_find_by(email: '383911973@qq.com') }
  let(:auth) { "Bearer #{user.generate_jwt}" }

  # 返回字段描述
  with_options :scope => :data do
    response_field :id, 'id'
    response_field :email, '用户邮箱'
    response_field :created_at, '创建时间'
    response_field :updated_at, '更新时间'
  end

  get '/api/v1/users' do
    example "获取单个标签信息" do
      do_request
      expect(status).to eq(200)
    end
  end
end
