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
    console.log(event)
    const array = ['usage','belong_to','authored_by','affiliated_with']
    var usage = ''
    var belong_to = ''
    var authored_by = ''
    var affiliated_with = ''
    var people = ''
    var made_by = ''
    var search_name = await g.V(event.arguments.name).values('name').toList()
    try {
        switch (event.arguments.value) {
            case 'person':
                usage = await g.V().has(event.arguments.value,'name', event.arguments.name)
                        .bothE().hasLabel(array[0])
                        .otherV()
                        .values('name').toList()
                belong_to = await g.V().has(event.arguments.value,'name', event.arguments.name)
                        .bothE().hasLabel(array[1])
                        .otherV()
                        .values('name').toList()
                authored_by = await g.V().has(event.arguments.value,'name', event.arguments.name)
                        .bothE().hasLabel(array[2])
                        .otherV()
                        .values('name').toList()
                affiliated_with = await g.V().has(event.arguments.value,'name', event.arguments.name)
                        .bothE().hasLabel(array[3])
                        .otherV()
                        .values('name').toList()
                console.log(usage)
                return [{search_name,usage,belong_to,authored_by,affiliated_with}]
                break;
            case 'id' :
                usage = await g.V().hasId(event.arguments.name).bothE().hasLabel(array[0]).otherV().values('name').toList()
                if ( event.arguments.name.match(/Doc/)) {
                    belong_to = await g.V().hasId(event.arguments.name).bothE().hasLabel(array[1]).otherV().values('name').toList()
                }else{
                    belong_to = []
                }
                authored_by = await g.V().hasId(event.arguments.name).bothE().hasLabel(array[2]).otherV().values('name').toList()
                affiliated_with = await g.V().hasId(event.arguments.name).bothE().hasLabel(array[3]).otherV().values('name').toList()
                if ( event.arguments.name.match(/Prod/)) {
                    made_by = await g.V().hasId(event.arguments.name).out('made_by').values('name').toList()
                }else{
                    made_by = []
                }
                if ( event.arguments.name.match(/Conf/)) {
                    people = await g.V().hasId(event.arguments.name).in_().values('name').toList()
                }else{
                    people = []
                }
                if ( event.arguments.name.match(/Inst/)){
                    affiliated_with = []
                }
                return [{search_name,usage,belong_to,authored_by,affiliated_with,made_by,people}]
                break;
            case 'product':
                console.log(event.arguments)
                made_by = await g.V().has(event.arguments.value,'name', event.arguments.name)
                    .out('made_by')
                    .values('name').toList()
                return[{search_name,made_by}]
                break;
            case 'conference':
                console.log(event.arguments)
                people = await g.V().has(event.arguments.value,'name', event.arguments.name)
                    .in_()
                    .values('name').toList()
                return[{search_name,people}]
                break;
            default:
                console.log('default')
        }        
      } catch (error) {
        console.error(JSON.stringify(error))
        return { error: error.message }
      }
}
