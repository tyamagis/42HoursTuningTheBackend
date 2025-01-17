// GET records/{recordId}/comments
// コメントの取得
const getComments = async (req, res) => {
    let user = await getLinkedUser(req.headers);
  
    if (!user) {
      res.status(401).send();
      return;
    }
  
    const recordId = req.params.recordId;
  
    const commentQs = `select * from record_comment where linked_record_id = ? order by created_at desc`;
  
    const [commentResult] = await pool.query(commentQs, [`${recordId}`]);
    mylog(commentResult);
  
    const commentList = Array(commentResult.length);
  
    const searchPrimaryGroupQs = `select * from group_member where user_id = ? and is_primary = true`;
    const searchUserQs = `select * from user where user_id = ?`;
    const searchGroupQs = `select * from group_info where group_id = ?`;
    for (let i = 0; i < commentResult.length; i++) {
      let commentInfo = {
        commentId: '',
        value: '',
        createdBy: null,
        createdByName: null,
        createdByPrimaryGroupName: null,
        createdAt: null,
      };
      const line = commentResult[i];
  
      const [primaryResult] = await pool.query(searchPrimaryGroupQs, [line.created_by]);
      if (primaryResult.length === 1) {
        const primaryGroupId = primaryResult[0].group_id;
  
        const [groupResult] = await pool.query(searchGroupQs, [primaryGroupId]);
        if (groupResult.length === 1) {
          commentInfo.createdByPrimaryGroupName = groupResult[0].name;
        }
      }
  
      const [userResult] = await pool.query(searchUserQs, [line.created_by]);
      if (userResult.length === 1) {
        commentInfo.createdByName = userResult[0].name;
      }
  
      commentInfo.commentId = line.comment_id;
      commentInfo.value = line.value;
      commentInfo.createdBy = line.created_by;
      commentInfo.createdAt = line.created_at;
  
      commentList[i] = commentInfo;
    }
  
    for (const row of commentList) {
      mylog(row);
    }
  
    res.send({ items: commentList });
  };