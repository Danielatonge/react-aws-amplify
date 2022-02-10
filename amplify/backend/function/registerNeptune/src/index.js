const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const P = gremlin.process.P
const Order = gremlin.process.order
const Scope = gremlin.process.scope
const Column = gremlin.process.column

exports.handler = async (event, context, callback) => {
    const dc = new DriverRemoteConnection(`wss://${process.env.NEPTUNE_ENDPOINT}:${process.env.NEPTUNE_PORT}/gremlin`,{});
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const id = gremlin.process.t.id
    const array = ['person','institution','paper','conference','product']
    if (event.arguments.value == 'vertex') {
        var currentId = await g.V().hasLabel(event.arguments.vertex).toList()
        var new_id = currentId.length + 1
    }
    try {
        switch (event.arguments.value) {
            case 'vertex':
                switch (event.arguments.vertex) {
                    case 'person':
                        var person_id = 'Doc'+ new_id
                        const vertex1 = await g.addV(event.arguments.vertex).property(id, person_id).property('name', event.arguments.name).property('speciality',event.arguments.property).next()
                        return [{'result':vertex1}]
                    case 'paper':
                        var paper_id = 'Paper'+ new_id
                        const vertex2 = await g.addV(event.arguments.vertex).property(id, paper_id).property('name', event.arguments.name).property('speciality',event.arguments.property).next()
                        return [{'result':vertex2}]
                    case 'conference':
                        var conf_id = 'Conf' + new_id
                        const vertex3 = await g.addV(event.arguments.vertex).property(id, conf_id).property('name', event.arguments.name).next()
                        return [{'result':vertex3}]
                    case 'product':
                        var prod_id = 'Prod' + new_id
                        const vertex4 = await g.addV(event.arguments.vertex).property(id, prod_id).property('name', event.arguments.name).next()
                        return [{'result':vertex4}]
                    default:
                        var inst_id = 'Inst' + new_id
                        const vertex5 = await g.addV(event.arguments.vertex).property(id, inst_id).property('name', event.arguments.name).next()
                        return [{'result':vertex5}]
                }
            default:
                const edge1 = await g.V().hasLabel(event.arguments.sourceLabel).has('name', event.arguments.source)
                .addE(event.arguments.edge)
                .to(g.V().hasLabel(event.arguments.destLabel).has('name', event.arguments.destination))
                .next()
                return [{'result':edge1}]
        }
        
      } catch (error) {
        console.error(JSON.stringify(error))
        return { error: error.message }
      }
}
