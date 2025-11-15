document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    };

    // Navbar affix & Scroll reveal listener
    window.addEventListener('scroll', () => {
        // Navbar
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('affix');
        } else {
            navbar.classList.remove('affix');
        }

        // Back to top button
        const backToTopBtn = document.getElementById('back-to-top');
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        revealOnScroll();
    });

    // Initialize Swiper for teachers
    const initTeacherSwiper = (teachers) => {
        const swiperWrapper = document.querySelector('#guru .swiper-wrapper');
        if (!swiperWrapper) return;

        teachers.forEach(teacher => {
            const slide = document.createElement('div');
            slide.className = `swiper-slide ${teacher.image}`;
            slide.innerHTML = `
                <span>${teacher.name}</span>
                <div>
                    <h2>${teacher.subject}</h2>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        new Swiper(".swiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true
            },
            spaceBetween: 60,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            }
        });
    };

    // Create student card
    const createStudentCard = (student) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'col-auto mb-4';
        cardContainer.innerHTML = `
            <div class="student-card">
                <div class="student-card-img-wrapper">
                    <img class="student-card-img" src="${student.image}" alt="${student.name}" />
                </div>
                <div class="student-card-name">${student.name}</div>
            </div>
        `;
        return cardContainer;
    };

    // Render students for a specific class
    const renderStudents = (students, classId) => {
        const panel = document.querySelector(`#${classId}-panel .card-deck`);
        if (!panel) return;
        
        panel.innerHTML = ''; // Clear existing students to re-render
        students.forEach(student => {
            const studentCard = createStudentCard(student);
            panel.appendChild(studentCard);
        });
    };

    // Tab functionality for students
    const setupStudentTabs = (allStudents) => {
        const tabs = document.querySelectorAll('.tabs .tab');
        const panels = document.querySelectorAll('.panels .panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Handle tab active state
                tabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');

                // Show corresponding panel
                const targetPanelId = tab.getAttribute('for');
                panels.forEach(p => p.style.display = 'none');
                const targetPanel = document.getElementById(`${targetPanelId}-panel`);
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                }
            });
        });

        // Initial render
        renderStudents(allStudents.tkj1, 'one');
        renderStudents(allStudents.tkj2, 'two');
        
        // Set initial active state
        document.getElementById('one-tab').classList.add('active-tab');
        document.getElementById('one-panel').style.display = 'block';
        document.getElementById('two-panel').style.display = 'none';
    };

    // Search functionality for students
    const setupStudentSearch = (allStudents) => {
        const searchInput = document.getElementById('student-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            const filterStudents = (studentList) => {
                return studentList.filter(student => 
                    student.name.toLowerCase().includes(searchTerm)
                );
            };

            // Re-render students with filtered results
            renderStudents(filterStudents(allStudents.tkj1), 'one');
            renderStudents(filterStudents(allStudents.tkj2), 'two');
        });
    };

    // Render subjects
    const renderSubjects = (subjects) => {
        const grid = document.getElementById('subjects-grid');
        if (!grid) return;

        subjects.forEach(subject => {
            const cardWrapper = document.createElement('li'); // Changed from figure to li for semantic correctness inside <ul>
            cardWrapper.className = 'subject-card-wrapper';
            // Pass all necessary data to the modal trigger
            cardWrapper.innerHTML = `
                <div class="subject-card" data-toggle="modal" data-target="#subjectModal" data-title="${subject.title}" data-description="${subject.description}" data-image="${subject.image}" data-alt="${subject.alt}" data-link="${subject.link}">
                    <div class="card-image">
                        <img src="${subject.image}" alt="${subject.alt}" />
                    </div>
                    <div class="card-content">
                        <h3>${subject.title}</h3>
                        <p>${subject.description}</p>
                    </div>
                </div>
            `;

            grid.appendChild(cardWrapper);
        });
    };

    // Handle modal data population
    $('#subjectModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const title = button.data('title');
        const description = button.data('description');
        const image = button.data('image');
        const alt = button.data('alt');
        const link = button.data('link');

        const modal = $(this);
        modal.find('.modal-title').text(title);
        modal.find('.modal-body').html(`
            <img src="${image}" alt="${alt}" class="img-fluid mb-3 rounded modal-subject-img">
            <p>${description}</p>
        `);
        modal.find('.modal-footer').html(`
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            <a href="${link}" target="_blank" class="btn btn-primary btn-visit-modal">Kunjungi Referensi</a>
        `);
    });

    // Fetch all data
    const fetchData = async () => {
        try {
            const [teachersRes, studentsRes, subjectsRes] = await Promise.all([
                fetch('./teachers.json'),
                fetch('./students.json'),
                fetch('./subjects.json')
            ]);

            if (!teachersRes.ok || !studentsRes.ok || !subjectsRes.ok) {
                throw new Error('Network response was not ok.');
            }

            const teachers = await teachersRes.json();
            const students = await studentsRes.json();
            const subjects = await subjectsRes.json();

            initTeacherSwiper(teachers);
            setupStudentTabs(students);
            setupStudentSearch(students);
            renderSubjects(subjects);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    fetchData();
    
    // Initial check for reveal elements on load
    revealOnScroll();
});