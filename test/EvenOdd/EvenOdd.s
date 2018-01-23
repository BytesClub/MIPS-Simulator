# EvenOdd.s
#
# This program checks if a number is Even or Odd
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

	.data	# Data declaration
# Output Strings
ev_string:	.asciiz	"\nThe Number is Even\n"
od_string:	.asciiz	"\nThe Number is Odd\n"

	.text	# Assembly Instructions
main:		# Code starts here
    li $s0, 52
    li $s1, 2
    div $s0, $s1
    bez $hi, even           # Check if remainder is zero
    li $v0, 4               # System call code for printing string is 4
    la $a0, od_string       # Output string passed as argument
    syscall                 # This will call OS to print ($a0)
    li $v0, 10              # System call code for exit is 10
    syscall                 # Program terminated by OS
even:
    li $v0, 4               # System call code for printing string is 4
    la $a0, ev_string       # Output string passed as argument
    syscall                 # This will call OS to print ($a0)
    li $v0, 10              # System call code for exit is 10
    syscall                 # Program terminated by OS
