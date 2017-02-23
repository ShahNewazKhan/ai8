// var sphero = require("sphero"),
// bb8 = sphero("b2f945ecaaf342d49c78d7f31c4b5c90"); // change BLE address accordingly 

var getinfo = null;
var startTraning = true;

var initSpec = function()
{
    var spec = {}
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.01; // value function learning rate
    spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 20;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100 // number of neurons in hidden layer

    return spec;
}

function startTraining()
{
    if (startTraining)
    {
        startTraining = false;

        // create an environment object
        var env = {};
        env.getNumStates = function() { return 4; }
        env.getMaxNumActions = function() { return 4; }

        // create the DQN agent
        var spec = this.initSpec();
        agent = new RL.DQNAgent(env, spec); 

        trainingInt = setInterval(function()
        {   // start the learning loop
            
            var inputs = this.getBB8Stats(null, false);

            var action = agent.act(inputs); // s is an array of length 4

            console.log("Action: " + action);
            
            this.getBBStats(action, true);
            
            var reward = Math.random();

            agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float

            if(typeof agent.expi !== 'undefined') {
                //window.document.getElementById("expi").innerHTML = agent.expi;
                console.log('Experience: ' + agent.expi)
            }

            if(typeof agent.tderror !== 'undefined') {
                //window.document.getElementBy("#expi").html(agent.expi);
                console.log('TD Error:  ' + agent.tderror.toFixed(3));
            }

        }, 0); // end traininng interval
    }else{
        
        clearInterval(trainingInt);
        startTraining = true;
    }
}

var getBB8Stats = function(action, move)
{
    bb8.connect(function()
    {
        var inputs = []
        orb.streamVelocity();

        orb.on("velocity", function(data) {
            console.log("velocity:");
            console.log("  sensor:", data.xVelocity.sensor);
            console.log("    range:", data.xVelocity.range);
            console.log("    units:", data.xVelocity.units);
            console.log("    value:", data.xVelocity.value[0]);

            inputs[0] = data.xVelocity.value[0]
            inputs[1] = data.xVelocity.range

            console.log("  sensor:", data.yVelocity.sensor);
            console.log("    range:", data.yVelocity.range);
            console.log("    units:", data.yVelocity.units);
            console.log("    value:", data.yVelocity.value[0]);

            inputs[0] = data.yVelocity.value[0]
            inputs[1] = data.yVelocity.range
        })

        if(move){
            switch (action) {
                case 0:
                    // up
                    bb8.roll(0)
                    break;
                case 1:
                    // down
                    bb8.roll(180)
                    break;
                case 2:
                    // left
                    bb8.roll(270)
                    break;
                case 3:
                    //
                    bb8.roll(90)
                    break;
            }
        }
        
    });
}