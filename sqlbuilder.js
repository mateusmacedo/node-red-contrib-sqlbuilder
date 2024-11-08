const knex = require('knex')

module.exports = function (RED) {
  function SQLBuilderNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.field = config.field;
    node.fieldType = config.fieldType;
    node.sqldialect = config.sqldialect;
    node.sqlquery = config.sqlquery;

    node.on('input', function (msg, send, done) {
      let sql;
      try {
        const db = knex({ client: node.sqldialect });
        sql = db.raw(node.sqlquery).toString();
      } catch (error) {
        node.error('sql : builder error', msg);
        node.status({ fill: 'red', shape: 'dot', text: 'failed' });
        msg.payload = error;
        send(msg);
        done();
        return;
      }

      // Set msg to the set property
      if (node.fieldType === 'msg') {
        RED.util.setMessageProperty(msg, node.field, sql);
        send(msg);
        done();
      } else if (node.fieldType === 'flow' || node.fieldType === 'global') {
        const context = RED.util.parseContextStore(node.field);
        const target = node.context()[node.fieldType];
        target.set(context.key, sql, context.store, function (err) {
          if (err) {
            done(err);
          } else {
            send(msg);
            done();
          }
        });
      } else {
        // should never reach here
        msg.payload = sql;
        send(msg);
        done();
      }
    });
  }

  RED.nodes.registerType('sqlbuilder', SQLBuilderNode);
}
