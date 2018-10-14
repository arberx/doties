# oh-my-zsh installation.
  export ZSH=/home/arberx/.oh-my-zsh

# POWERLEVEL CONFIG OPTIONS
ZSH_THEME="powerlevel9k/powerlevel9k"
POWERLEVEL9K_MODE=nerdfont-fontconfig
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs virtualenv)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()

# plugin config
AUTO_LS_NEWLINE=false

plugins=(
  git zsh-autosuggestions auto-ls
)

source $ZSH/oh-my-zsh.sh

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='vim'
else
  export EDITOR='code'
fi

# ssh
export SSH_KEY_PATH="~/.ssh/rsa_id"
export PATH=$PATH:~/bin

# aliases
alias caen="ssh axhindol@login-course-2fa.engin.umich.edu"
alias site="ssh root@45.55.37.226"
alias update="_ apt-get update"
alias upgrade="_ apt-get upgrade"
alias autoremove="_ apt-get autoremove"
alias refresh="source ~/.zshrc"
alias sl="ls"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
