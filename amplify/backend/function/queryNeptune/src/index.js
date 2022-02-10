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
        switch (event.arguments.value) {
            case 'person':
                const result = await g.V().has(event.arguments.value,'name', event.arguments.name).as(event.arguments.value)
                .out('belong_to')
                .in_().where(P.neq(event.arguments.value))
                .values('name').dedup()
                .toList();
                return result.map( (r) => {
                    return {'name':r}
                })
                
            case 'product':
                const result2 = await g.V().has(event.arguments.value,'name', event.arguments.name).as(event.arguments.value)
                .in_('usage').as('p')
                .in_('authored_by')
                .out().where(P.neq('p'))
                .values('name').dedup()
                .toList();
                return result2.map( (r) => {
                  return { 'name':r }
                })
            case 'conference':
                console.log(event.arguments)
                const result3 = await g.V().has(event.arguments.value,'name', event.arguments.name).as(event.arguments.value)
                .in_().as('p')
                .out()
                .hasLabel('person').where(P.neq('p'))
                .values('name').dedup()
                .toList();
                console.log(result3)
                return result3.map( (r) => {
                  return { 'name':r}
                })
            default:
                console.log('default')
        }
      } catch (error) {
        console.error(JSON.stringify(error))
        return { error: error.message }
      }
}
