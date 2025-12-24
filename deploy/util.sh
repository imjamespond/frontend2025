BAK=${1:-"nobak"}

function deploy()
{
  
Host=$1
Dir=$2
Target=$3

echo "${Host}\n${Dir}\n${Target}"

Now=$(date +"%F-%H-%M");
TmpDir=$Dir-$Now

scp -r ./dist/$Dir ${Host}:/tmp/$TmpDir
ssh -tt $Host << EOF
  cd ${Target};
  if [ $BAK == "bak" ]; then
    mv ./$Dir ./$TmpDir
  else
    rm -rf ./${Dir}
  fi
  mv /tmp/$TmpDir ./$Dir
  ls -l ./
  exit  # 显式退出远程会话
EOF

}