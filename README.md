# node-red-contrib-hexa-data-connector
MQTT Adapter for Hexa-data

Node to format MQTT messages intended to be uploaded to Hexa-data software from Hexa-AI (www.hexa-ai.fr) This node buffers the values and timestamps and publishes the values at the defined interval. If there is no interval set, the default is 5 seconds

### Inputs

payload Object

Contains the value to be returned as well as its description (name, value and data type) Payload Ex:`{name:"testMsg","value":12.3,"type":"real"}`

### Details

`msg.payload.name` Is a string containing the variable name declared in hexa-data

`msg.payload.value` Is the value to publish on hexa-data

`msg.payload.type` Describes the type of value to publish ("boolean", "integer", "real", "string") One thing remains to be improved on the hexa-data side, for reals if there are no decimal places, this node automatically adds 0.1 to the value

### References

*   [GitHub](https://github.com/Hexa-ai/node-red-contrib-hexa-data-connector) - the nodes github repository
