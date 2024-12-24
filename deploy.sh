function sshp() {
  sshpass -p $SSH_PASSWORD ssh -o LogLevel=error -o StrictHostKeyChecking=no $SSH_DEST $1
}

echo "===> clean folder"
sshp "rm -rf $REMOTE_PATH && mkdir $REMOTE_PATH"

echo "===> deploy"
tar cf - -C dist . | sshp "tar x -C $REMOTE_PATH"

echo "===> restart server"
curl --silent --basic --user "$ALWAYS_KEY account=$ALWAYS_ACCOUNT:" --data '' --request POST https://api.alwaysdata.com/v1/site/$ALWAYS_SITE_ID/restart/
