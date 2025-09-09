#!/bin/bash
export NODE_ENV=development
export FUNCTIONS_WORKER_RUNTIME=node
func start --port 7072 --host 0.0.0.0
