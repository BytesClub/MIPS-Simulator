# LoadStore.s
#
# This program prints Hello World in console
# Copyright (C) 2017 Bytes Club <bytes-club@googlegroups.com>
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    .text                   # Assembly Instructions
main:                       # Code starts here
    li $t1, 30              # Data to be stored is 30
    li $t2, 25              # Target address for storing is 25
    sw $t1, $t2, 0          # Store data in specified memory address
    li $v0, 1               # System call code for printing integer is 1
    lw $a0, $t2             # Load data from target address (25)
    syscall                 # This will call OS to print ($a0)
    li $v0, 10              # System call code for exit is 10
    syscall                 # Program terminated by OS
