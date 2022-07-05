import db from './mysql';
import { sendErrorResponse, sendResponse, getHash, verify } from './utils';

const routes = {};

routes['discuss'] = async (params, tag, ws) => {
  try {
    if (!(await verify(params.address, params.sig, params.data)))
      sendErrorResponse(ws, tag, 'wrong signature');
    const id = getHash(params.data);
    const discussion = {
      id,
      author: params.data.message.from,
      title: params.data.message.title,
      body: params.data.message.body,
      votes: 0,
      created: params.data.message.created
    };
    await db.queryAsync('INSERT INTO discussions SET ?', [discussion]);
    return sendResponse(ws, tag, { id, success: true });
  } catch (e) {
    console.log('failed', e);
    return sendErrorResponse(ws, tag, 'failed');
  }
};

routes['propose'] = async (params, tag, ws) => {
  try {
    if (!(await verify(params.address, params.sig, params.data)))
      sendErrorResponse(ws, tag, 'wrong signature');
    const id = getHash(params.data);
    const proposal = {
      id,
      author: params.data.message.from,
      discussion: params.data.message.discussion,
      body: params.data.message.body,
      scores_1: 0,
      scores_2: 0,
      scores_3: 0,
      scores_total: 0,
      votes: 0,
      created: params.data.message.created
    };
    await db.queryAsync('INSERT INTO proposals SET ?', [proposal]);
    return sendResponse(ws, tag, { id, success: true });
  } catch (e) {
    console.log('failed', e);
    return sendErrorResponse(ws, tag, 'failed');
  }
};

routes['vote'] = async (params, tag, ws) => {
  try {
    if (!(await verify(params.address, params.sig, params.data)))
      sendErrorResponse(ws, tag, 'wrong signature');
    const choice = params.data.message.choice;
    if (![1, 2, 3].includes(choice)) return sendErrorResponse(ws, tag, 'failed');
    const discussion = params.data.message.discussion;
    const proposal = params.data.message.proposal;
    const vp = 1;
    const vote = {
      voter: params.data.message.from,
      discussion: params.data.message.discussion,
      proposal,
      choice,
      vp,
      created: params.data.message.created
    };
    await db.queryAsync('INSERT INTO votes SET ?', [vote]);
    await db.queryAsync(
      `UPDATE proposals SET scores_${choice} = scores_${choice} + ?, scores_total = scores_total + ?, votes = votes + 1 WHERE id = ? LIMIT 1;
       UPDATE discussions SET votes = votes + 1 WHERE id = ? LIMIT 1;`,
      [vp, vp, proposal, discussion]
    );
    return sendResponse(ws, tag, { success: true });
  } catch (e) {
    console.log('failed', e);
    return sendErrorResponse(ws, tag, 'failed');
  }
};

routes['get_discussion'] = async (params, tag, ws) => {
  const query = 'SELECT * FROM discussions WHERE id = ? LIMIT 1';
  const [discussion] = await db.queryAsync(query, [params]);
  return sendResponse(ws, tag, discussion);
};

routes['get_discussions'] = async (params, tag, ws) => {
  const query = 'SELECT * FROM discussions ORDER BY created DESC LIMIT 5';
  const discussions = await db.queryAsync(query);
  return sendResponse(ws, tag, discussions);
};

routes['get_proposals'] = async (params, tag, ws) => {
  const query =
    'SELECT *, (scores_1 / scores_total) AS percent_1 FROM proposals WHERE discussion = ? ORDER BY percent_1 DESC, created DESC';
  const proposals = await db.queryAsync(query, [params]);
  return sendResponse(ws, tag, proposals);
};

routes['get_votes'] = async (params, tag, ws) => {
  const query = 'SELECT * FROM votes WHERE voter = ?';
  const votes = await db.queryAsync(query, [params]);
  return sendResponse(ws, tag, votes);
};

routes['get_voters'] = async (params, tag, ws) => {
  const query =
    'SELECT DISTINCT(voter) AS voter, vp FROM votes WHERE discussion = ? ORDER BY vp DESC LIMIT 100';
  const voters = await db.queryAsync(query, [params]);
  return sendResponse(ws, tag, voters);
};

export default routes;
