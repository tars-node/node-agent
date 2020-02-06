# @ tars / node-agent

In order for Node.js applications to run in the TARS framework, `node-agent` will be used as a launcher to launch the application and provide the service features required by the production environment.

It mainly provides the following functions:

* __Built-in load balancing (implemented through the Cluster module)__
* __Monitoring and Pulling of Abnormal Exit__
* __Log collection and processing__
* __Supports management commands for the TARS platform__
* __Support HTTP (s) service monitoring and reporting (running on TARS platform)__
* __Support service usage report (run on TARS platform__

## Installation

`npm install @ tars/node-agent -g`

> Since `node-agent` is a CLI program, it usually needs to be installed with the __- g__ parameter

## Usage

`node-agent app.js [options]`

* app.js is the entry script for the program, see [entry point](#entrypoint) for details
* [options] Optional configuration, see [Options](#options) section

## Examples

Execute the app.js file:  
> $ node-agent app.js

Start with the configuration file for the `TARS` service:
> $ node-agent app.js --config MTT.Test.conf

Launch and name the app MTT.Test:
> $ node-agent app.js --name MTT.Test

Define log output path
> $ node-agent app.js --log ./logs/

Pass the startup parameters of the child node `node`:
> $ node-agent app.js --node-args = "-debug = 7001"

Define the number of child processes:
> $ node-agent app.js -i 4

## Entry point

The second parameter passed when `node-agent` starts is used to specify the entry point file for service script execution, where:

 * Can be directly passed into the script file for execution, such as `./App.js`

 * You can also pass in the directory where the script file is located, such as `./`

When a directory is passed in, the entry point is confirmed in the following order:

1. The `package.json` file exists in the directory, then:
1. Find `nodeAgent.main`
2. Find `script.start` (this configuration section needs to start with` node` to recognize)
3. Find `main`
2. Find if it exists in the directory: `server.js`,` app.js`, `start.js`,` index.js`

As long as one of these matches is executed as an entry point file, no further matching is performed.

## options


> Options:
>   -h, --help                                     output usage information  
>   -V, --version                                  output the version number  
>   -c, --config <config>                          specify tars config file. NOTE: independent config will be override this  
>   -n, --name <name>                              set a <name> for script - e.g. app.servername  
>   -l, --log <path>                               specify log file  
>   -i, --instances <number>                       launch [number] instances (for networked app)(load balanced)  
>   --env <environment_name>                       specify environment to get specific env variables (for JSON declaration)  
>   --http-address <http_address>                  specify http ip:port address to pass to script - e.g. 127.0.0.1:80  
>   --script-args <script_args>                    space delimited arguments to pass to script - e.g. --use="https"  
>   --node-args <node_args>                        space delimited arguments to pass to node - e.g. --node-args="--debug=7001 --trace-deprecation"  
>   --run-as-user <run_as_user>                    The user or uid to run a managed process as  
>   --run-as-group <run_as_group>                  The group or gid to run a managed process as  
>   --max-memory-restart <memory>                  specify max memory amount used to autorestart (in megaoctets)  
>   --graceful-shutdown <graceful>                 specify graceful shutdown timeout (in millisecond), default is 8000ms  
>   --exception-max <exp_max>                      The program will be terminated if an exceeding max exception count, default is 5  
>   --exception-time <exp_time>                    The program will be terminated if an exception occurs within a particular period of time, default is 5000ms  
>   --keepalive-time <detect_time>                 specify the interval for detecting the worker which could be set to [off] if you want to debug and the default value is 60s  
>   --applog-max-files <applog_max_files>          specify max number of rolling log, default is 10  
>   --applog-max-size <applog_max_size>            specify max file size for each rolling log, use human readable unit in [K|G|M], default is 10M  
>   --applog-level <applog_level>                  define log level, default is DEBUG  
>   --tars-node <tars_node>                        set tars node conncetion string, agent would send notifications to tars node - e.g. tars.tarsnode.ServerObj@tcp -h 127.0.0.1 -p 10000 -t 60000  
>   --tars-local <tars_local>                      set local interface setup string, agent would receive the notifications from tars node - e.g. tcp -h 127.0.0.1 -p 10000 -t 3000  
>   --tars-monitor <tars_monitor>                  enable or disable service monitor running in tars platform, and the default value is on  
>   --tars-monitor-http-threshold <http_threshold> if the http(s) status code is large than the preseted threshold then this request will be considered error. default threshold is 400, set it "off" to disabled  
>   --tars-monitor-http-seppath <http_seppath>     separate url pathname as interface name, default is on  
>   --tars-monitor-http-socketerr <http_socketerr> considered socket error as error, default is on  
>   --long-stack <long_stack>                      enable long stack trace to auto append asynchronous stack, default is off  
>   --long-stack-filter-usercode <stack_usercode>  filter long stack trace keep user module code only, default is off  

### -c, --config

If this service is a TARS service, you can specify the service's profile here.

The configuration file will be automatically read in as the basic configuration. You can override the imported basic configuration by setting other configuration parameters.

### -n, --name

You can specify the service name here.

* If not configured, use _script filename_
* For TARS service, the service name must be in the format _app.serverName_

### -l, --log

Specify the root directory of the output log file

If not configured, all log output is _stdout / stderr_ output

### -i, --instances

`node-agent` uses Node.js'native [Cluster](http://www.nodejs.org/api/cluster.html "Cluster") module to implement load balancing.

The number of child processes (business processes) started by `node-agent` can be configured here:

* Not configured (or configured as `auto`,`0`), the number of child processes started is equal to the `CPU physical core` number.

* Configured as `max`, the number of child processes started equals the number of CPUs (all cores).

If `node-agent` is started by`tarsnode`, the `tars.application.client.asyncthread` configuration section in the TARS configuration file is automatically read.

It can also be adjusted via `TARS Platform-> Edit Services-> Number of Asynchronous Threads`.

### --env

Set the _environment variable_ when the service is started, which needs to be described in `JSON` format

For example: this configuration can be passed into the current operating environment (development, production)

```js
{\ "NODE_ENV \": \ "production \"}
```

__Please note: When passed as a command line parameter, the double quotes (") need to be escaped (\")__

If the service is a TARS service, this parameter is read and set in a way that `tarsnode` recognizes.

### --http-address

Set the ip: port required for service script execution

You can use the environment variables `HTTP_IP` (`IP`), `HTTP_PORT` (`PORT`) in the script to obtain

```js
process.env.HTTP_IP
process.env.HTTP_PORT
```

If this service is a TARS service, the value here is the `ip: port` specified in the configuration file by the first non-TARS Servant

### --script-args

Set the parameters required for service script execution

E.g:

> $ node-agent app.js --script-args = "-use =" https "

Equivalent to

> $ node app.js --use = "https"

### --node-args

Set the startup parameters required by the node cluster child process

E.g:

> $ node-agent app.js --node-args = "-debug = 7001 --trace-deprecation"

Equivalent to

$ node --debug = 7001 --trace-deprecation app.js

### --run-as-user, --run-as-group

Specify the user (group) for the `node cluster` child process

This can be used to downgrade the service script. If the permission is not configured, it is equivalent to `node-agent`.

### --max-memory-restart

Specifies the maximum memory that can be used by the service.

If the child process reaches the maximum memory limit, it will throw an exception and exit. This _ (resource-shaped) _ exception is also handled as an overall exception.

### --graceful-shutdown

Normally, `node-agent` will notify the service via` worker.disconnect() `when stopping the service (process), and let the service release resources and exit.

You can set the timeout here. If the service (process) does not exit after a given time, `node-agent` will force` kill` to kill the process.

Timeout is 8 seconds by default

If `node-agent` is started by` tarsnode`, the `tars.application.server.deactivating-timeout` configuration section in the TARS configuration file is automatically read.

### --exception-max, --exception-time

If the (service) child process exits abnormally, and within a period of time _(-exception-time)_ The number of abnormal exits does not exceed the maximum value _(-exception-max)_. `node-agent` will automatically start a new (service) child process, otherwise` node-agent` and the service will also exit abnormally.

To facilitate third-party management tools to monitor service status

--exception-time default is 10s  
--exception-max default is 2

### --keepalive-time

If `node-agent` does not receive the heartbeat sent by the (service) child process within a period of time (--keepalive-time), then this (service) child process is determined to be a zombie process and will directly kill `kill` and handle it as an exception.

_This logic is not triggered when the server `Free Memory` is too small._

__If you want to (breakpoint) debug the service script, you need to set this to `--keepalive-time = off`__

Its default value is 5m

### --applog-max-files, --applog-max-size, --applog-level

Specify the service's default rolling log size _(-applog-max-size)_, total _(-applog-max-files)_ and log level _(-applog-level)_.

Two main (rolling) logs are created when the service starts:

* app.serverName.log: `stdout / stderr / console` of the service started
* app.serverName_agent.log: status information of `node-agent`

This configuration mainly affects the output parameters of the above two main (rolling) logs

See [logs](#logs "logs") for details

### --tars-node, --tars-local

If `node-agent` is started by` tarsnode`, you need to specify the RPC connection parameter _(-tars-node)_ of tarsnode and the startup parameter _(-tars-local)_ which is called locally.

This setting can also be specified via the TARS configuration file _(-tars-config)_.

`node-agent` will report the service version to`tarsnode` when the service is started, and send heartbeat packets during the service running.

At the same time, the (started) service started locally by `node-agent` will also receive the issued messages (shutdown / message) from` tarsnode` and respond.

### --tars-monitor

If your service is running on the `TARS` platform,` node-agent` will automatically report service monitoring (usage) information to `tarsstat`.

The default value is on, set to off to turn off the automatic report function.

For details, please refer to the “Monitoring and Usage Reporting” section.

### --tars-monitor-http-threshold

If your service's HTTP(s) return code is greater than this threshold, the request will be reported as an abnormal access.

By default [response.statusCode> = 400](http://www.nodejs.org/api/http.html#http_response_statuscode) is abnormal access.

Set to off to turn this feature off.

For details, please refer to the “Monitoring and Usage Reporting” section.

### --tars-monitor-http-seppath

Whether the HTTP (s) service needs to distinguish different paths when reporting.

The default is to distinguish between paths. The part of url.pathname will be reported as the interface name of the service.

If your service has very large (large cardinality) pathnames (such as RESTful), you can set it to off.

For details, please refer to the “Monitoring and Usage Reporting” section.

### --tars-monitor-http-socketerr

By default, the HTTP (s) service accesses [Socket Exception](https://nodejs.org/api/errors.html#errors_common_system_errors) as an exception when reporting.

If you want to turn this feature off, you can set it to off

### --long-stack, --long-stack-filter-usercode

When this feature is enabled, an asynchronous call stack is automatically attached when an exception occurs, helping to quickly locate asynchronous call problems.

If you want to filter out the stack generated by user code (module), you can enable `--long-stack-filter-usercode`.

This feature requires a Node.js version greater than v8.2.x

__This feature will cause performance loss. Do not enable performance sensitive code.__

For details, please see the [LongStack](https://www.npmjs.com/package/longstack) description.

## Configuration

`node-agent` supports startup in multiple configurations:

* Command line parameters are specified
* Specified in `package.json` of the service script
* Specified in the configuration file of the `TARS` service

among them:

* The value specified in the `package.json` or` TARS` configuration file will overwrite the configuration items specified in the command line parameters.
* The configuration parameters can be declared in the configuration section of `nodeAgent` in` package.json` by camel case.
* Declare directly in the configuration file of the `TARS` service as a configuration parameter prototype

For example (start the child process as nobody):

Command line parameters:
> node-agent app.js --run-as-user = nobody

package.json:
>``` js
>{  
>  "nodeAgent" : {  
>    "runAsUser" : "nobody"  
>  }  
>} 
>```

TARS configuration file:
>```xml
> <tars>
> <application>
> <server>
> run-as-user = nobody
> </ server>
> </ application>
> </ tars>
> ```

## Messages and events

In general, user code does not need to process (follow) process messages and events, but if you want to process (response): process exit, TARS management commands, you need to process.

### process.on ('disconnect', function)

For specific description of this event, please refer to [Cluster Event: 'disconnect'](http://www.nodejs.org/api/cluster.html#cluster_event_disconnect)

By default `node-agent` will process this event, but if user code listens (handles) the event,`node-agent` will no longer process it.

__Please note: After you process the event, please be sure to call `process.exit()` to ensure that the process can exit normally__

### process.on ('message', object)

Once `node-agent` receives the management command from` tarsnode`, it will send the process script to the business script.

The format of the passed message `object` is:

```js
{
  cmd: String,
  data: String
}
```

Supported messages `cmd` are:

* tars.viewstatus: View service status
* tars.setloglevel: Set the log level
* tars.loadconfig: PUSH configuration file
* tars.connection: View the current link situation
* Custom commands

`Cmd` with` data` exists:

* tars.setloglevel: `INFO`,` DEBUG`, `WARN`,` ERROR`, `NONE`
* tars.loadconfig: configuration file name
* Custom commands
* process.msg: [all | worker_id]: Custom message object across processes

\* `node-agent` will split the` custom command`, the characters before the first space in the command are used as `cmd`, and the subsequent parts are used as` data`

### process.send (object)

Send a command to the main process so that the main process performs a specific operation.

The format of the passed message `object` is the same as the format of the received message.

#### cmd = process.msg: [all | worker_id]

With this command, you can send a custom message to the child process specified by the parameter.

* all: send to all child processes (including themselves)
* worker_id: sent to a specific child process, where worker_id is the `process sequence ID` (process.env.WORKER_ID)

__ All messages will be relayed through the main process. The main process is likely to become a performance bottleneck under large message volumes. Please use it with caution!__

## Log

`node-agent` redirects the output of the service (the output of the` stdout | stderr` pipe and the `console` module) to the specified file (when started with the` -l --log` parameter) or pipe.

The log output is implemented by the [winston-tars](https://github.com/tars-node/winston-tars "winston-tars") module, and the output log format is: `datetime | PID | log level | File name: line number | content`

The service script can output logs of different levels through the `console` module that comes with` node`.

console.info = INFO
console.log = DEBUG
console.warn = WARN
console.error = ERROR

It can also be output through the service's `stdout | stderr` pipe.

> process.stdout = INFO
> process.stderr = ERROR

The priority of the log level is: `INFO` <` DEBUG` <`WARN` <` ERROR` <`NONE`

Among them, the default log level is: `DEBUG`

## Environment variables

`node-agent` provides the required variables to the service script via environment variables:

* `process.env.IP`: The IP that HTTP (s) can listen on.
* `process.env.PORT`: HTTP (s) listenable port.
* `process.env.WORKER_ID` Process sequence ID (for example, start 8 processes, the first is 0, the second is 1, and so on), the restarted process still uses the previous ID.

If the service is started by `tarsnode`, the following variables are also supported:

* `process.env.TARS_CONFIG`: The absolute path where the TARS configuration file used to start the service is located.
* `process.env.TARS_MONITOR`: Whether to enable monitoring (characteristic) reporting (statistics).

__Please note: all environment variables are of type String__

## Monitoring and reporting

If your service is running on the `TARS` platform,` node-agent` will automatically report service monitoring (usage) information to `tarsstat`.

### Monitoring information

The reporting of monitoring information is related to the service you started and its caller (can be viewed through `TARS Platform-> Service Monitoring`):

* HTTP (s)
* Server: [response.statusCode> = 400](http://www.nodejs.org/api/http.html#http_response_statuscode) failed, and the timeout of all requests is 0
* Configurable via [--tars-monitor-http-threshold](# tars-monitor-http-threshold) and [--tars-monitor-http-seppath](# tars-monitor-http-seppath)

For more details, please visit [@ tars / monitor.stat](https://github.com/tars-node/monitor).

### Dosage Information

No matter what type of service you start, the usage information is always reported (can be viewed via `TARS Platform-> Feature Monitoring`):

* memoryUsage: memory usage, which will be reported as `rss`,` heapUsed`, and `heapTotal` (in bytes)
* cpuUsage: CPU usage, CPU usage will be reported, and data will be aggregated into logical single cores (unit is percentage)
* eventloopLag: Event loop lag (V8 message queue delay), sample every 2 seconds (unit is millisecond)
* libuv: I / O usage, will report the usage of `activeHandles` and` activeRequests`

The statistical strategy of all usage information is `Avg`,` Max`, `Min`

## Nondestructive operation

If your service is running on the `TARS` platform, every time a non-destructive restart or release:

1. Set the traffic status to no traffic (including routing and third-party traffic)
2. Wait for the caller to get the configuration (default is 2 minutes 13 seconds)
3. Perform the corresponding operation (restart or release)
4. Restore traffic status

__Please note: If a large number of nodes perform non-destructive operations at the same time, the traffic of these nodes will be blocked at the same time, which may cause service instability. A non-destructive batch restart is recommended.__

### Warm up

During the service startup of non-destructive operation, you can choose whether to warm up:

1. After the service is started, check if all child processes are listening on the port every second (all child processes are ONLINE)
2. If the warm-up timeout period is exceeded and not all child processes are listening on the port, the non-destructive operation process fails and the user is notified (email notification)

__We strongly recommend that: In any case, please complete all initialization operations before listening to the (listen) port.__

## Architecture

![PM2](https://github.com/tars-node/node-agent/blob/master/doc/architecture.png?raw=true)

When `node-agent` starts (that is, executes` cluster.fork`) service script, it does not directly load the corresponding script, but loads `node-agent / ProcessContainer.js` to wrap the service script. Then call the system's `require` to load the execution script