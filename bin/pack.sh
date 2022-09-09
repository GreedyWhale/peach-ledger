echo '运行测试'
../bin/rake docs:generate

echo '打包前端文件'
yarn build

echo '拷贝api文档'
cp -r /root/repos/peach-ledger/doc /root/repos/peach-ledger/views/dist/doc 

echo 'ok!'