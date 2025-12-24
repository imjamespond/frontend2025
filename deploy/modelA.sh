pnpm build

Host=frontend@192.168.0.12
Dir=data-atlas
Target=/home/frontend/modela

source $(dirname "$0")/util.sh
deploy $Host $Dir $Target