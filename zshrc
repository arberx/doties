### .zshrc - arberx

# set terminal color values.
export TERM=xterm-256color

# POWERLEVEL CONFIG OPTIONS
# ZSH_THEME="powerlevel9k/powerlevel9k"
# POWERLEVEL9K_MODE=nerdfont-fontconfig
# POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs virtualenv)
# POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()

# plugin config
AUTO_LS_NEWLINE=false
plugins=(
  git zsh-autosuggestions auto-ls
)

# oh-my-zsh intialization.
ZSH_THEME=simple
export ZSH=/home/arberx/.oh-my-zsh
source $ZSH/oh-my-zsh.sh

# set editor depending on conneciton.
if [[ -n "$SSH_CONNECTION" ]]; then
  export EDITOR='vim'
else
  export EDITOR='code'
fi

# ssh
export SSH_KEY_PATH="~/.ssh/rsa_id"
export PATH=$PATH:~/bin

# aliases
alias caen="ssh axhindol@login-course-2fa.engin.umich.edu"
alias update="_ apt-get update"
alias upgrade="_ apt-get upgrade -y"
alias autoremove="_ apt-get autoremove"
alias refresh="source ~/.zshrc"
alias sl="ls"
alias SL="ls"
alias pdf="xdg-open"
alias sleep="_ systemctl suspend"
alias sa="source env/bin/activate"
alias da="deactivate"
alias logout="sudo pkill -u arberx"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
eval $(thefuck --alias)
