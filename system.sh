#!/bin/bash

# directly write to /proc/sys file
set_proc_sys_param() {
  local param=$1
  local value=$2
  local file="/proc/sys/$param"
  current_value=$(cat $file)

  if [ "$current_value" -lt "$value" ]; then
    echo "Updating $param from $current_value to $value"
    echo $value | sudo tee $file
    if ! grep -q "$param" /etc/sysctl.conf; then
      echo "$param=$value" | sudo tee -a /etc/sysctl.conf
    else
      sudo sed -i "s/^$param=.*/$param=$value/" /etc/sysctl.conf
    fi
  else
    echo "$param is already $current_value, no need to update."
  fi
}

# set ulimit parameter
set_ulimit_param() {
  local param=$1
  local value=$2
  current_value=$(ulimit -n)

  if [ "$current_value" -lt "$value" ]; then
    echo "Updating ulimit $param from $current_value to $value"
    echo "* soft $param $value" | sudo tee -a /etc/security/limits.conf
    echo "* hard $param $value" | sudo tee -a /etc/security/limits.conf
  else
    echo "ulimit $param is already $current_value, no need to update."
  fi
}

# check available RAM
check_ram() {
  total_ram=$(free -m | awk '/^Mem:/{print $2}')
  echo "Total RAM: ${total_ram}MB"
  if [ "$total_ram" -ge 15360 ]; then
    return 0
  else
    return 1
  fi
}

# create swap file
create_swap_file() {
  swap_size_gb=5
  swap_file="/swapfile"

  if [ ! -f $swap_file ]; then
    free_space=$(df -h / | awk 'NR==2 {print $4}' | sed 's/G//')
    echo "Free disk space: ${free_space}GB"
    if (( $(echo "$free_space > $swap_size_gb" | bc -l) )); then
      echo "Creating swap file of ${swap_size_gb}GB"
      sudo fallocate -l ${swap_size_gb}G $swap_file
      sudo chmod 600 $swap_file
      sudo mkswap $swap_file
      sudo swapon $swap_file
      echo "$swap_file none swap sw 0 0" | sudo tee -a /etc/fstab
    else
      echo "Not enough storage to create a swap file. Free up some space."
      exit 1
    fi
  else
    echo "Swap file already exists."
  fi
}

# Set vm.max_map_count
set_proc_sys_param "vm/max_map_count" 262144

# Set memory overcommit
set_proc_sys_param "vm/overcommit_memory" 1

# Check RAM and set swappiness accordingly
if check_ram; then
  echo "RAM is sufficient, setting swappiness to 10"
  set_proc_sys_param "vm/swappiness" 10
else
  echo "RAM is less than 15GB, creating swap file and setting swappiness to 60"
  create_swap_file
  set_proc_sys_param "vm/swappiness" 60
fi

# Set file descriptors limit (ulimit -n)
set_ulimit_param "nofile" 65536

echo "All settings have been applied."