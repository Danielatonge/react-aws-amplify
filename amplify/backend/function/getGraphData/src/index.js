const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const P = gremlin.process.P
const Order = gremlin.process.order
const Scope = gremlin.process.scope
const Column = gremlin.process.column

exports.handler = async (event, context, callback) => {
    const dc = new DriverRemoteConnection(`wss://${process.env.NEPTUNE_ENDPOINT}:${process.env.NEPTUNE_PORT}/reactamplifyneptunewgremlin`,{});
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    try {
        const result = await g.V().toList()
        const vertex =  result.map(r => {
            return {'id':r.id,'label':r.label}
        })
        const result2 = await g.E().toList()
        const edge = result2.map(r => {
            console.log(r)
            return {"source": r.outV.id,"target": r.inV.id,'value':r.label}
        })
        return {'nodes':vertex,"links":edge}
      } catch (error) {
        console.error(JSON.stringify(error))
        return { error: error.message }
      }
}
